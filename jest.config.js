/** @type {import('ts-jest').JestConfigWithTsJest} **/
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  testEnvironment: "node", // Entorno Node.js para pruebas
  preset: "ts-jest", // Utilizar ts-jest para transformar TypeScript
  transform: {
    "^.+\\.(t|j)s$": "ts-jest", // Transformar archivos .ts y .js
  },
  moduleFileExtensions: ["js", "json", "ts"], // Extensiones que Jest debe manejar
  testRegex: "spec.ts$", // Correr solo los archivos que terminan en spec.ts
  collectCoverageFrom: ["<rootDir>/src/**/*.{ts,js}"], // Cobertura solo de archivos en src/
  coverageDirectory: "./coverage", // Directorio donde almacenar el reporte de cobertura
  testPathIgnorePatterns: ["\\\\node_modules\\\\"], // Ignorar node_modules
  setupFilesAfterEnv: ["tsconfig-paths/register"], // Resolver rutas absolutas del tsconfig.json
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1"
  }
};
