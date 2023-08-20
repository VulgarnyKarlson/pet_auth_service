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
COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/ ./.yarn
RUN yarn install

COPY . ./
RUN yarn build

# Avoid running code as a root user
RUN useradd -m myuser
USER myuser

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s \
CMD node ./healthcheck/client.js
CMD ["pm2-runtime", "ecosystem.config.js"]
EXPOSE 3000 5000
