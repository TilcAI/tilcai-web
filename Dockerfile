# tilcai-web in a container: the site and the monitoring dashboard (/[lang]/monitor).
#
#   docker build -t tilcai/tilcai-web:local .
#   docker run -d --name tilcai-web -p 3311:3000 -v tilcai-web-data:/data \
#     -e MONITOR_INGEST_SECRET=… -e MONITOR_DASHBOARD_TOKEN=… \
#     -e MONITOR_STORE_FILE=/data/monitor-events.json tilcai/tilcai-web:local
#
# One instance with MONITOR_STORE_FILE keeps the events across restarts, which the in-memory
# store of a serverless deployment cannot do. The backend pushes to /api/monitor/events
# (its MONITOR_WEB_URL) signed with MONITOR_INGEST_SECRET (its MONITOR_WEB_SECRET).
FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN npm install -g pnpm@11
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app ./
RUN mkdir /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/en').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["node", "node_modules/next/dist/bin/next", "start"]
