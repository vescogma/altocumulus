import { existsSync, mkdirSync, readFileSync } from "fs";
import { execSync } from "child_process";

export const getListAffectedOutput = () => {
  if (!existsSync("../../tmp")) {
    mkdirSync("../../tmp");
  }
  execSync(`
    cd ../../ \
    && yarn --silent list:affected > ./tmp/list-affected.txt
  `);
  const listAffectedOutput = readFileSync(
    "../../tmp/list-affected.txt"
  ).toString();
  return JSON.parse(
    listAffectedOutput.slice(listAffectedOutput.indexOf("{\n"))
  );
};

export const getWorkspacesInfoOutput = () => {
  if (!existsSync("../../tmp")) {
    mkdirSync("../../tmp");
  }
  execSync(`
    cd ../../ \
    && yarn --silent workspaces info > ./tmp/workspaces-info.txt
  `);
  const workspacesInfoOutput = readFileSync(
    "../../tmp/workspaces-info.txt"
  ).toString();
  return JSON.parse(
    workspacesInfoOutput.slice(workspacesInfoOutput.indexOf("{\n"))
  );
};
