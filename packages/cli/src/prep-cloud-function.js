import { execSync } from "child_process";

/**
 * @param {import('plop').NodePlopAPI} plop
 */
export default function main(plop) {
  plop.setActionType("pruneCloudFunction", function (answers, config, plop) {
    execSync(`cd ../../ && yarn compile --scope=@ac/${answers.name}`);
    return `pruned "out" dir created for workspace @ac/${answers.name}`;
  });

  plop.setActionType("addFunctionsFramework", function (answers, config, plop) {
    execSync(`cd ../../out && yarn add -W @google-cloud/functions-framework`);
    return `added functions-framework dep to "out" dir`;
  });

  plop.setGenerator("prep-cloud-function", {
    description: "prep a cloud function for deployment",
    prompts: [
      {
        type: "input",
        name: "domain",
        message: "cloud function domain",
      },
      {
        type: "input",
        name: "name",
        message: "cloud function name",
      },
    ],
    actions: [
      { type: "pruneCloudFunction" },
      {
        type: "modify",
        path: "../../out/package.json",
        pattern: `  "scripts": {`,
        templateFile: "./templates/cloud-function-package-entry.hjs",
      },
      { type: "addFunctionsFramework" },
    ],
  });
}
