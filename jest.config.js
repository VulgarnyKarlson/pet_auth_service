const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
module.exports = {
  preset: 'ts-jest',
  rootDir: ".",
  testEnvironment: "node",
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    "/^(.*)$/": "<rootDir>/src/$1"
  },
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/auth/infrastructure/**/*.ts",
    "!<rootDir>/src/shared/logging/*.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
};
