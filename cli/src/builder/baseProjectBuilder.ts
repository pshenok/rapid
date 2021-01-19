import fs from "fs";
import { createAbstractConfig } from "../../../templates/AbstractConfig";
import { createAppError } from "../../../templates/AppError";
import { createEditorConfig } from "../../../templates/editorconfig";
import { createJestConfigJSON, createJestE2EConfigJSON } from "../../../templates/jestConfig";
import { createLogger } from "../../../templates/Logger";
import { createTsConfig } from "../../../templates/tsconfig";

export function createBaseProjectFiles(projectName: string, configPath: string, path?: string): void {
  const projectPath = `${path || '.'}/${projectName}`;
  const srcPath = `${projectPath}/src`;
  const appPath = `${projectPath}/src/app`;
  fs.mkdirSync(projectPath);
  fs.mkdirSync(srcPath);
  fs.mkdirSync(appPath);

  //src
  createEditorConfig(srcPath);
  createJestE2EConfigJSON(srcPath);
  createJestConfigJSON(srcPath);
  createTsConfig(srcPath);

  //app
  createAbstractConfig(appPath);
  createAppError(appPath);
  createLogger(appPath);

  console.log("\x1b[37m", `Congrats!\nBase Snappy Project built in ${projectPath}`)
}