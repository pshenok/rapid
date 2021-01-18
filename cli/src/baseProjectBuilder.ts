import fs from "fs";
import path from "path";
import { createAbstractConfig } from "../../templates/AbstractConfig";
import { createAppError } from "../../templates/AppError";
import { createEditorConfig } from "../../templates/editorconfig";
import { createJestConfigJSON, createJestE2EConfigJSON } from "../../templates/jestConfig";
import { createLogger } from "../../templates/Logger";
import { createTsConfig } from "../../templates/tsconfig";

function copyFileSync(source: string, target: string) {
  let targetFile = target;

  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyRecursiveSync(source: string, target: string) {
  const targetFolder = path
    .join(target, path.basename(source))
    .toLowerCase()
    .trim()
    .replace(/\s/gi, "");

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    for (const file of files) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    }
  }
}

function createBaseProjectFiles(projectName: string, path?: string): void {
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