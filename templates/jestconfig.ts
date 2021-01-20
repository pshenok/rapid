import fs from 'fs';
import dedent from 'dedent';

export function createJestConfigJSON(path: string): void {
	fs.writeFileSync(`${path}/jest.config.json`, dedent`
{
	"collectCoverage": false,
	"collectCoverageFrom": [
		"src/**/*.ts"
	],
	"coverageDirectory": "coverage",
	"coverageReporters": [
		"text"
	],
	"testEnvironment": "node",
	"testMatch": [
		"**/*.spec.ts"
	],
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
	},
	"verbose": true
}
	`)
}

export function createJestE2EConfigJSON(path: string): void {
	fs.writeFileSync(`${path}/jest.config.e2e.json`, dedent`
{
	"collectCoverage": false,
	"collectCoverageFrom": [
		"src/**/*.ts"
	],
	"coverageDirectory": "coverage",
	"coverageReporters": [
		"text"
	],
	"testEnvironment": "node",
	"testMatch": [
		"**/test/**/*.e2e.ts"
	],
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
	},
	"verbose": true
}`)
}