# NextJS PWA Task Manager - Implementation Plan

## Overview
A Progressive Web App built with Next.js and Redux Toolkit that allows users to create tasks with subtasks, organize them into groups/tags, and view them on a dashboard. All data persists in browser localStorage. Deployable to GitHub Pages and as a Docker container.

---

## Phase 1: Project Scaffolding
- Initialize Next.js 14+ with TypeScript (App Router)
- Install and configure **Tailwind CSS v3** with PostCSS and Autoprefixer
- Configure `tailwind.config.ts` with custom theme (colors, fonts, spacing, animations)
- Configure ESLint with security rules (`eslint-plugin-security`)
- Configure Prettier with `prettier-plugin-tailwindcss` (auto-sorts classes)
- Set up path aliases (`@/components`, `@/store`, `@/types`, etc.)
- Add `.gitignore`, `.editorconfig`
- **Static export** config (`output: 'export'`) for GitHub Pages compatibility

## Phase 2: Redux Toolkit Store with localStorage Persistence
- Install `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- Create store with `redux-persist` using `localStorage` engine
- Configure `PersistGate` for rehydration
- Slices:
  - `tasksSlice` — CRUD for tasks and subtasks
  - `groupsSlice` — CRUD for groups
  - `tagsSlice` — CRUD for tags
  - `uiSlice` — active view, filters, sidebar state
- Selectors for filtered/sorted task lists

## Phase 3: Data Models
```typescript
interface Task {
  id: string;           // uuid
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  groupId?: string;
  tagIds: string[];
  subtasks: Subtask[];
  createdAt: string;    // ISO date
  updatedAt: string;
  dueDate?: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Group {
  id: string;
  name: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}
```

## Phase 4: Core UI Components (Tailwind CSS Styling)
All components styled with **Tailwind CSS** — no external UI library.

### Design System (Tailwind Theme)
- **Colors**: Indigo/violet primary palette, slate neutrals, semantic colors for status/priority
- **Typography**: Inter font via `next/font`, clear hierarchy (`text-xs` to `text-3xl`)
- **Spacing**: Consistent 4px grid (`p-2`, `p-4`, `gap-3`, `gap-6`)
- **Borders**: Subtle `rounded-xl` cards, `ring` focus states for accessibility
- **Shadows**: Layered `shadow-sm` / `shadow-md` / `shadow-lg` for depth
- **Transitions**: `transition-all duration-200` on interactive elements
- **Dark mode**: `dark:` variants using Tailwind's `class` strategy + system preference detection

### Components
- **Layout**: Collapsible sidebar (`w-64` → `w-16`) + main content area, fully responsive with `md:` breakpoints
- **TaskList**: Filterable, sortable list with `divide-y` separators, hover states (`hover:bg-slate-50`)
- **TaskCard**: Rounded card with colored priority indicator (left border), status badge (`rounded-full` pill), subtask progress bar (`bg-gradient-to-r`)
- **TaskDetail**: Slide-over panel or full page, clean form inputs with `focus:ring-2 focus:ring-indigo-500`
- **TaskForm**: Modal with `backdrop-blur-sm` overlay, grouped form sections
- **SubtaskList**: Checkbox list with strikethrough animation on completion
- **GroupManager**: Color-coded group chips with dropdown color picker
- **TagManager**: Pill-shaped tags (`rounded-full px-3 py-1`) with assigned colors
- **SearchBar**: `pl-10` with search icon, `focus-within:` ring highlight
- **Buttons**: Primary (`bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg`), secondary (outline), destructive (red), icon-only variants
- **Empty states**: Centered illustrations/icons with descriptive text and CTA button

## Phase 5: Dashboard Views (Tailwind CSS Styling)
- **View Switcher**: Segmented control bar (`inline-flex rounded-lg bg-slate-100 p-1`) in the dashboard header
- **List View**: Clean table with `divide-y divide-slate-200`, sortable column headers with hover indicators, alternating row hover states
- **Board View**: Kanban columns with `bg-slate-50 rounded-xl` containers, draggable cards with `shadow-sm hover:shadow-md` lift effect, column headers with task count badges
- **Group View**: Collapsible sections per group, group color as left accent bar, task count per group
- **Tag View**: Tag filter bar at top (`flex flex-wrap gap-2`), active tag highlighted with `ring-2`, filtered task grid below
- **Stats Panel**: Grid of stat cards (`grid grid-cols-2 lg:grid-cols-4 gap-4`) with large numbers, trend indicators, mini progress rings/bars using Tailwind gradients

## Phase 6: PWA Setup
- `next-pwa` or manual service worker with Workbox
- `manifest.json` with app name, icons, theme color, `display: standalone`
- Generate PWA icons (multiple sizes)
- Offline fallback page
- Cache strategies: network-first for pages, cache-first for static assets
- Install prompt handling

## Phase 7: SSR / Static Optimization
- Since data lives in localStorage (client-only), SSR renders the **app shell** (layout, navigation, empty states)
- Use `'use client'` directives for Redux-connected components
- Server components for layout, static content, metadata
- `loading.tsx` skeleton screens using Tailwind `animate-pulse` with `bg-slate-200 rounded` placeholders
- Dynamic imports with `next/dynamic` for heavy components (board view, charts)
- Metadata API for SEO tags

## Phase 8: Security Hardening
- **Content Security Policy** headers via `next.config.js`
- **Input sanitization**: DOMPurify for any user-provided HTML/markdown
- **XSS prevention**: React's built-in escaping + CSP
- **No `dangerouslySetInnerHTML`** without sanitization
- **Strict TypeScript** (`strict: true`, `noUncheckedIndexedAccess`)
- **Dependency auditing**: `npm audit` in CI
- **localStorage validation**: Schema validation on rehydration (guard against tampered data)
- **Subresource Integrity** for external scripts (if any)
- **Referrer-Policy, X-Content-Type-Options, X-Frame-Options** headers

## Phase 9: Hardened Dockerfile (Node.js v24)
```dockerfile
# Multi-stage build
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS runner
RUN apk update && apk upgrade && apk add --no-cache dumb-init
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

USER appuser
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```
Hardening measures:
- Alpine-based minimal image
- Non-root user
- `npm ci --ignore-scripts` (prevent postinstall attacks)
- `dumb-init` for proper signal handling
- No dev dependencies in production image
- Read-only filesystem compatible
- Health check endpoint

## Phase 10: GitHub Pages Deployment
- `next.config.js`: `basePath: '/NextJS'` (matches repo name)
- `output: 'export'` for static HTML generation
- GitHub Actions workflow (`.github/workflows/deploy.yml`):
  1. Checkout → Install → Build → Export
  2. Deploy to `gh-pages` branch using `actions/deploy-pages`
- `assetPrefix` set to repo name for correct asset paths
- `.nojekyll` file in output to prevent Jekyll processing
- CNAME handling if custom domain needed

## Phase 11: Testing & Polish
- Unit tests for Redux slices (Jest + RTL)
- Component tests for key UI flows
- Lighthouse audit (PWA score, performance, accessibility)
- Accessibility: ARIA labels, keyboard navigation, focus management
- **Dark mode**: Tailwind `dark:` class strategy, toggle in header, respects `prefers-color-scheme`, smooth `transition-colors duration-300`
- **Responsive design**: Mobile-first (`sm:`, `md:`, `lg:`, `xl:` breakpoints), sidebar collapses to bottom nav on mobile, board view scrolls horizontally on small screens

---

## Tailwind CSS Theme Configuration
```typescript
// tailwind.config.ts (key customizations)
{
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,      // Main action color
        accent: colors.violet,       // Secondary accents
        success: colors.emerald,     // Done / completed
        warning: colors.amber,       // In progress / medium priority
        danger: colors.rose,         // High priority / destructive
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.15s ease-in',
      },
      keyframes: {
        slideIn: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
    },
  },
}
```

## File Structure
```
NextJS/
├── .github/workflows/deploy.yml
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sw.js
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (server component)
│   │   ├── page.tsx            # Dashboard page
│   │   ├── loading.tsx         # Loading skeleton
│   │   └── tasks/
│   │       └── [id]/page.tsx   # Task detail page
│   ├── components/
│   │   ├── layout/
│   │   ├── tasks/
│   │   ├── dashboard/
│   │   └── common/
│   ├── store/
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   └── slices/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── sanitize.ts
│   │   └── validation.ts
│   └── hooks/
│       └── useAppSelector.ts
├── Dockerfile
├── .dockerignore
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── tsconfig.json
├── package.json
└── PLAN.md
```

---

## Resumability
Each phase is self-contained and can be started/stopped independently. The todo list in the session tracks progress. To resume:
1. Read this PLAN.md
2. Check which phases are complete (look at existing files)
3. Continue from the next incomplete phase
