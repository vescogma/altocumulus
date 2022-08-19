import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { chdir } from "process";

/**
 * @param {import('plop').NodePlopAPI} plop
 */
export default function main(plop) {
  plop.setGenerator("list-deploy-functions", {
    description: "list functions to be deployed",
    prompts: [],
    actions: [
      async () => {
        chdir("../../");
        if (!existsSync("./temp")) {
          mkdirSync("./temp");
        }
        execSync(`yarn list:affected > ./temp/list-affected.txt`);
        execSync(`yarn workspaces info > ./temp/workspaces-info.json`);
        const affectedOutput = readFileSync(
          "./temp/list-affected.txt"
        ).toString();
        const listAffected = JSON.parse(
          affectedOutput.slice(affectedOutput.indexOf("{\n"))
        );
        const affectedMap = listAffected.packages.reduce(
          (acc, pkgKey) => ({ ...acc, [pkgKey]: true }),
          {}
        );
        const workspacesInfo = JSON.parse(
          readFileSync("./temp/workspaces-info.json").toString()
        );
        const matchingWorkspaces =
          Object.keys(workspacesInfo)
            .filter(
              (pkgKey) =>
                workspacesInfo[pkgKey].location.match("apps/functions/") !==
                  null && affectedMap[pkgKey]
            )
            .join("\n") + "\n";
        console.log(`functions-to-deploy:\n${matchingWorkspaces}`);
        writeFileSync("./temp/functions-to-deploy.txt", matchingWorkspaces);
        return `listed functions to be deployed`;
      },
    ],
  });
}
