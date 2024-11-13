FROM node:20-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
RUN ls
RUN pnpm install
RUN pnpm run build

FROM node:20-alpine as prod
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY --from=base /app/dist /app/dist
COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/pnpm-lock.yaml /app/pnpm-lock.yaml
WORKDIR /app
RUN pnpm install -P
RUN ls
CMD ["node", "dist/main"]