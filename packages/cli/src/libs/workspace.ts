import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "child_process";

export const getListAffectedOutput = async () => {
  await mkdir(join("..", "..", "tmp"), { recursive: true });
  execSync(`
    cd ../../ \
    && yarn --silent list:affected > ./tmp/list-affected.txt
  `);
  const filePath = join("..", "..", "tmp", "list-affected.txt");
  const affectedData = await readFile(filePath, { encoding: "utf8" });
  return JSON.parse(affectedData.slice(affectedData.indexOf("{\n")));
};

export const getWorkspacesInfoOutput = async () => {
  await mkdir(join("..", "..", "tmp"), { recursive: true });
  execSync(`
    cd ../../ \
    && yarn --silent workspaces info > ./tmp/workspaces-info.txt
  `);
  const filePath = join("..", "..", "tmp", "workspaces-info.txt");
  const infoData = await readFile(filePath, { encoding: "utf8" });
  return JSON.parse(infoData.slice(infoData.indexOf("{\n")));
};

export const isExistingPackage = async (packageName: string) => {
  const packages = await getWorkspacesInfoOutput();
  return Boolean(packages[packageName]?.location);
};
