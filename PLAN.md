# NextJS PWA Task Manager - Implementation Plan

## Overview
A Progressive Web App built with Next.js and Redux Toolkit that allows users to create tasks with subtasks, organize them into groups/tags, and view them on a dashboard. All data persists in browser localStorage. Deployable to GitHub Pages and as a Docker container.

---

## Phase 1: Project Scaffolding
- Initialize Next.js 14+ with TypeScript (App Router)
- Configure ESLint with security rules (`eslint-plugin-security`)
- Configure Prettier
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

## Phase 4: Core UI Components
- **Layout**: Sidebar + Main content area (responsive)
- **TaskList**: Filterable, sortable list of tasks
- **TaskCard**: Summary card with status, priority, progress bar
- **TaskDetail**: Full task view/edit with subtask management
- **TaskForm**: Create/edit task modal/page
- **SubtaskList**: Checkbox list within TaskDetail
- **GroupManager**: Create/edit/delete groups
- **TagManager**: Create/edit/delete tags
- **SearchBar**: Full-text search across tasks
- Use CSS Modules or Tailwind CSS for styling (no external UI library needed)

## Phase 5: Dashboard Views
- **List View**: Default table/list of all tasks with sorting & filtering
- **Board View**: Kanban-style columns by status (todo/in_progress/done)
- **Group View**: Tasks organized by group
- **Tag View**: Tasks filtered/grouped by tags
- **Stats Panel**: Task completion stats, overdue count, priority distribution
- View switcher in the dashboard header

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
- `loading.tsx` skeletons for perceived performance
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
- Dark mode support (CSS custom properties + system preference detection)
- Responsive design verification

---

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
