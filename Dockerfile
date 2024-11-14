FROM node:20-alpine as base
COPY . /app
WORKDIR /app
RUN ls
RUN npm install
RUN npm run build

FROM node:20-alpine as prod
COPY --from=base /app/dist /app/dist
COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm ci
RUN ls
CMD ["node", "dist/main"]