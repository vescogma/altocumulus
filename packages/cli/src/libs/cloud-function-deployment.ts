import {
  existsSync,
  readFileSync,
  renameSync,
  writeFileSync,
  rmSync,
  mkdirSync,
} from "fs";
import { promisify } from "util";
import { execSync, exec } from "child_process";
import { camelCase } from "change-case";

import {
  getListAffectedOutput,
  getWorkspacesInfoOutput,
} from "./deployment.js";

const asyncExec = promisify(exec);

export const getAllPackageNames = () => {
  const workspacesInfo = getWorkspacesInfoOutput();
  return Object.keys(workspacesInfo).filter(
    (pkgKey) =>
      workspacesInfo[pkgKey].location.match("apps/functions/") !== null
  );
};

export const getAffectedPackageNames = () => {
  const affectedInfo = getListAffectedOutput();
  const affectedMap = affectedInfo.packages.reduce(
    (acc: Record<string, true>, pkgKey: string) => ({ ...acc, [pkgKey]: true }),
    {}
  );
  return getAllPackageNames().filter((pkgKey) => affectedMap[pkgKey]);
};

export const getFunctionNameFromPackage = (packageName: string) =>
  packageName.replace("@ac/", "");

export const getInfoFromPackageName = (packageName: string) =>
  getFunctionNameFromPackage(packageName).split("--");

export const getEntryPointFromPackage = (packageName: string) => {
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

export const pruneCloudFunctionPackage = (packageName: string) => {
  execSync(`cd ../../ && yarn compile --scope=${packageName}`);
  const [domain, name] = getInfoFromPackageName(packageName);
  const dirPath = `../../tmp/out-${domain}-${name}`;
  if (!existsSync("../../tmp")) {
    mkdirSync("../../tmp");
  } else if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true });
  }
  renameSync("../../out", dirPath);
  const rootPackage = readFileSync(`${dirPath}/package.json`).toString();
  const toInject = getTemplatedPackageJson(domain, name);
  const modifiedPackage = rootPackage.replace('  "scripts": {\n', toInject);
  writeFileSync(`${dirPath}/package.json`, modifiedPackage);
  const gitIgnore = readFileSync(`${dirPath}/.gitignore`).toString();
  const modifiedGitIgnore = gitIgnore.replace("dist\n", "");
  writeFileSync(`${dirPath}/.gitignore`, modifiedGitIgnore);
  execSync(`cd ${dirPath} && yarn add -W @google-cloud/functions-framework`);
};

export const deployCloudFunction = async (packageName: string) => {
  const [domain, name] = getInfoFromPackageName(packageName);
  const fnName = getFunctionNameFromPackage(packageName);
  const entryPoint = getEntryPointFromPackage(packageName);
  console.log(`Deploying ${fnName} with entry point: ${entryPoint}...`);
  return asyncExec(`
    cd ../../tmp/out-${`${domain}-${name}`} \
    && gcloud functions deploy ${fnName} \
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
