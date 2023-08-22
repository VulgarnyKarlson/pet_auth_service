# Makefile
PRISMA_BIN = node_modules/.bin/prisma
JEST_BIN = node_modules/.bin/jest
DOTENV_BIN = node_modules/.bin/dotenv
ESLINT_BIN = node_modules/.bin/eslint --config .eslintrc.json
DATABASE_URL_CMD = DATABASE_URL=$(shell node -p "require('./dbconfig.js')")
PRISMA = $(DATABASE_URL_CMD) $(PRISMA_BIN)
JEST_CMD = $(DOTENV_BIN) -e .env.test -- $(JEST_BIN) -i --no-colors --collectCoverage --no-cache -c jest.config.js
TS_NODE_OPTIONS = -r ts-node/register -r tsconfig-paths/register

.PHONY: build clean lint start-dev start-prod test test-watch test-cov test-debug prisma-generate prisma-push prisma-push-test prisma-migrate

build:
	make clean && tsc --project tsconfig.build.json && make prisma-generate

prisma-generate:
	$(PRISMA) generate

prisma-push:
	$(PRISMA) db push

prisma-push-test:
	$(PRISMA) db push

prisma-migrate:
	$(PRISMA) migrate dev

clean:
	rm -rf dist

lint-check:
	$(ESLINT_BIN) "./src/**"

lint-fix:
	$(ESLINT_BIN) "./src/**" --fix

start-dev:
	node $(TS_NODE_OPTIONS) src/main.ts

start-prod:
	pm2-runtime ecosystem.config.js

test:
	$(JEST_CMD)

test-watch:
	$(JEST_CMD) --watch
