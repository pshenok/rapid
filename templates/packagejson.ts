import fs from 'fs';
import dedent from 'dedent';

interface IPackageJSONInput {
	path: string;
	projectName: string;
	version: string;
	description: string;
	author: string;
	sequelize: boolean;
	repository: {
		type: string;
		url: string;
		private: boolean;
	}
}

export function createPackageJSON(input: IPackageJSONInput): void {

	const devDependencies = {
		"@types/bcrypt": "^3.0.0",
		"@types/cls-hooked": "^4.3.0",
		"@types/dotenv": "^6.1.1",
		"@types/json-stringify-safe": "^5.0.0",
		"@types/log4js": "^2.3.5",
		"@types/node": "^12.0.2",
		// "@types/sequelize": "^4.28.8",
		"@types/uuid": "^3.4.4",
		"@typescript-eslint/eslint-plugin": "^2.1.0",
		"@typescript-eslint/parser": "^2.1.0",
		"dotenv": "^8.0.0",
		"eslint": "^6.3.0",
		"jest": "^24.8.0",
		"nodemon": "^1.18.10",
		"sinon": "^7.4.2",
		"ts-jest": "^24.0.2",
		"ts-node": "^8.2.0",
		"typescript": "^3.4.5"
	};

	const dependencies = {};

	const scripts = {
		"build": "tsc -p tsconfig.json",
		"start": "node dist/index.js",
		"start:dev": "node -r ts-node/register -r dotenv/config src/index.ts",
		"start:w": "nodemon --watch src --ext ts,json --exec 'yarn start:dev'",
		"clear": "rm -rf dist",
		"test:unit": "jest --config jest.config.json",
		"test:e2e": "jest --runInBand --config jest.config.e2e.json",
		"test:w": "jest --watch",
		"coverage": "jest --coverage",
		"lint": "eslint --quiet --ext ts,js .",
		"lint:fix": "eslint --fix --ext .ts .",
	};

	if (input.sequelize) {
		Object.assign(scripts, {
			"migrate:up": "node node_modules/.bin/sequelize db:migrate",
			"migrate:down": "node node_modules/.bin/sequelize db:migrate:undo",
			"migrate:status": "node node_modules/.bin/sequelize db:migrate:status",
			"migrate:dev:up": "node -r dotenv/config node_modules/.bin/sequelize db:migrate",
			"migrate:dev:down": "node -r dotenv/config node_modules/.bin/sequelize db:migrate:undo",
			"migrate:dev:status": "node -r dotenv/config node_modules/.bin/sequelize db:migrate:status"
		});
	}


	fs.writeFileSync(`${input.path}/package.json`, dedent`
{
	"name": ${input.projectName},
	"version": ${input.version},
	"description": ${input.description},
	"main": "dist/index.js",
	"scripts": ${scripts},
	"repository": {
		"type": ${input.repository.type},
		"url": ${input.repository.url}
	},
	"author": ${input.author},
	"license": "UNLICENSED",
	"private": ${input.repository.private},
	"dependencies": ${dependencies},
	"devDependencies": ${devDependencies}
}
	`)
}