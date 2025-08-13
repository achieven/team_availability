
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY backend .
RUN ls
RUN npm i
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Set a non-root user for security (optional but recommended)
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser
EXPOSE 3000

CMD ["node", "dist/main.js"]