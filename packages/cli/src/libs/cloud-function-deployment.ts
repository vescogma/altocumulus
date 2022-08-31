import { promisify } from "node:util";
import { join } from "node:path";
import childProcess from "node:child_process";
import { camelCase } from "change-case";

import {
  getListAffectedOutput,
  getPackageJson,
  getWorkspacesInfoOutput,
} from "./workspace.js";

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

export const deployCloudFunction = async (packageName: string) => {
  const [domain, name] = getInfoFromPackageName(packageName);
  const functionName = getFunctionNameFromPackageName(packageName);
  const entryPoint = getEntryPointFromPackageName(packageName);
  const { "@ac/deploy": deployOptions } = await getPackageJson(packageName);
  console.log(`Deploying ${functionName} with entry point: ${entryPoint}...`);
  return exec(`
    cd ${join("..", "..", "tmp", `out-${domain}-${name}`)} \
    && gcloud functions deploy ${functionName} ${deployOptions.join(" ")}
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
