.PHONY: build watch clean install run
default: build
TYPESCRIPT_VERSION=4.5.4 INSTALL_DIR=./node_modules/typescript/bin/
TSC=$(INSTALL_DIR)tsc

install:
	npm install
	npm i @types/node -D

build:
	$(TSC) --project tsconfig.json
		./node_modules/.bin/esbuild src/main.ts --platform=node --bundle --outfile=out.js; echo "#!/usr/bin/env node" | cat - out.js > /tmp/out && mv /tmp/out out.js;

watch:
	nodemon src/main.ts

clean:
	rm -rf ./dist; rm -rf ./node_modules;

run:
	ts-node --project tsconfig.json src/main.ts
