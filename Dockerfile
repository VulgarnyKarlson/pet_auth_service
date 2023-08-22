FROM node:20.5.1-buster

ENV TS_NODE_PROJECT=tsconfig.run.json
ENV PM2_INSTANCES=4
RUN npm install -g pm2@4.4.1
RUN npm install -g typescript
RUN pm2 install typescript
RUN yarn set version berry
RUN yarn set version latest
RUN yarn config set preferAggregateCacheInfo true
RUN yarn config set enableGlobalCache true
RUN yarn config set globalFolder /home/.yarn

WORKDIR /app
COPY .yarnrc.yml package.json yarn.lock .yarn/ ./
RUN yarn install

COPY . ./
RUN make build

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s \
CMD node ./healthcheck/client.js
CMD ["make", "start-prod"]
EXPOSE 3000 5000
