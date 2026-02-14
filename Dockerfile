# Stage 1: Builder
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only, skip scripts for security)
RUN npm ci --only=production --ignore-scripts

# Copy all source files
COPY . .

# Build the Next.js application (static export)
RUN npm run build

# Stage 2: Production runner with nginx
FROM nginx:alpine-slim AS runner

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Create non-root user and set ownership
RUN addgroup -g 1001 -S appuser && \
    adduser -S -D -H -u 1001 -h /usr/share/nginx/html -s /sbin/nologin -G appuser appuser && \
    chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
