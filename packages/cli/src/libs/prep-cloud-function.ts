import { existsSync } from "node:fs";
import { mkdir, rm, rename, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { join } from "node:path";
import childProcess from "node:child_process";

import { getInfoFromPackageName } from "./cloud-function-deployment.js";

const exec = promisify(childProcess.exec);

const getTemplatedPackageJson = (
  domain: string,
  name: string
) => `  "type": "module",
  "main": "./apps/functions/${domain}/${name}/dist/index.js",
  "exports": {
    "*": {
      "import": "./apps/functions/${domain}/${name}/dist/index.js",
      "require": "./apps/functions/${domain}/${name}/dist/index.cjs",
      "types": "./apps/functions/${domain}/${name}/dist/index.d.ts"
    }
  },
  "scripts": {
`;

export const pruneCloudFunctionPackage = async (packageName: string) => {
  const tmpPath = join("..", "..", "tmp");
  await exec(`cd ../../ && yarn compile --scope=${packageName}`);
  const [domain, name] = getInfoFromPackageName(packageName);
  const dirPath = join(tmpPath, `out-${domain}-${name}`);
  if (!existsSync(tmpPath)) {
    await mkdir(tmpPath);
  }
  if (existsSync(dirPath)) {
    await rm(dirPath, { recursive: true, force: true });
  }
  await rename(join("..", "..", "out"), dirPath);
  // handle .gitignore
  const gitIgnorePath = join(dirPath, ".gitignore");
  const gitIgnore = await readFile(gitIgnorePath, { encoding: "utf8" });
  const modifiedGitIgnore = gitIgnore.replace("dist\n", "");
  await writeFile(gitIgnorePath, modifiedGitIgnore);
  // handle root/package.json
  const toInject = getTemplatedPackageJson(domain, name);
  const rootPackagePath = join(dirPath, "package.json");
  const rootPackage = await readFile(rootPackagePath, { encoding: "utf8" });
  const modifiedPackage = rootPackage.replace('  "scripts": {\n', toInject);
  await writeFile(rootPackagePath, modifiedPackage);
  await exec(`cd ${dirPath} && yarn add -W @google-cloud/functions-framework`);
};
