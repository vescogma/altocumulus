import { existsSync } from "node:fs";
import { mkdir, rmdir, rename, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { join } from "node:path";
import childProcess from "node:child_process";
import { camelCase } from "change-case";

import { getListAffectedOutput, getWorkspacesInfoOutput } from "./workspace.js";

const exec = promisify(childProcess.exec);

export const getAllPackageNames = async () => {
  const workspacesInfo = await getWorkspacesInfoOutput();
  return Object.keys(workspacesInfo).filter(
    (pkgKey) =>
      workspacesInfo[pkgKey].location.match("apps/functions/") !== null
  );
};

export const getAffectedPackageNames = async () => {
  const affectedInfo = await getListAffectedOutput();
  const affectedMap = affectedInfo.packages.reduce(
    (acc: Record<string, true>, pkgKey: string) => ({ ...acc, [pkgKey]: true }),
    {}
  );
  const packageNames = await getAllPackageNames();
  return packageNames.filter((pkgKey) => affectedMap[pkgKey]);
};

export const getFunctionNameFromPackageName = (packageName: string) =>
  packageName.replace("@ac/", "");

export const getInfoFromPackageName = (packageName: string) =>
  getFunctionNameFromPackageName(packageName).split("--");

export const getEntryPointFromPackageName = (packageName: string) => {
  const [domain, name] = getInfoFromPackageName(packageName);
  return camelCase(`${domain}-${name}`);
};

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
    await rmdir(dirPath);
  }
  await rename(join("..", "..", "out"), dirPath);
  // handle .gitignore
  const gitIgnorePath = join(dirPath, ".gitignore");
  const gitIgnore = await readFile(gitIgnorePath, { encoding: "utf8" });
  const modifiedGitIgnore = gitIgnore.replace("dist\n", "");
  await writeFile(gitIgnorePath, modifiedGitIgnore);
  // handle package.json
  const toInject = getTemplatedPackageJson(domain, name);
  const rootPackagePath = join(dirPath, "package.json");
  const rootPackage = await readFile(rootPackagePath, { encoding: "utf8" });
  const modifiedPackage = rootPackage.replace('  "scripts": {\n', toInject);
  await writeFile(rootPackagePath, modifiedPackage);
  await exec(`cd ${dirPath} && yarn add -W @google-cloud/functions-framework`);
};

export const deployCloudFunction = async (packageName: string) => {
  const [domain, name] = getInfoFromPackageName(packageName);
  const functionName = getFunctionNameFromPackageName(packageName);
  const entryPoint = getEntryPointFromPackageName(packageName);
  console.log(`Deploying ${functionName} with entry point: ${entryPoint}...`);
  return exec(`
    cd ${join("..", "..", "tmp", `out-${domain}-${name}`)} \
    && gcloud functions deploy ${functionName} \
    --gen2 \
    --runtime=nodejs16 \
    --region=us-central1 \
    --source=. \
    --entry-point=${entryPoint} \
    --trigger-http \
    --allow-unauthenticated
  `);
};

export const deployConcurrently = async (packageNames: string[]) => {
  const byDomain = packageNames.reduce(
    (acc: Record<string, string[]>, pkgName) => {
      const [domain] = getInfoFromPackageName(pkgName);
      return { ...acc, [domain]: [...(acc[domain] ?? []), pkgName] };
    },
    {}
  );
  for (let domain of Object.keys(byDomain)) {
    console.log(`Deploying functions in ${domain}...`);
    const results = await Promise.allSettled(
      byDomain[domain].map((pkgName) => deployCloudFunction(pkgName))
    );
    console.log(
      results
        .map(
          (result, idx) =>
            `Function ${byDomain[domain][idx]} status: ${result.status}\n`
        )
        .join("")
    );
  }
};
