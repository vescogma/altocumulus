import { createCommand } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getAffectedPackageNames } from "../libs/cloud-function-deployment.js";
import { CliCommand } from "../libs/typings.js";

const config = {
  id: "create-deployment-config",
  title: "⚙️  Create deployment config",
  description: "store deployment configuration file to /tmp",
};

const action = async () => {
  const configMap = {
    "cloud-functions": getAffectedPackageNames().length > 0,
  };
  const configOutput = Object.keys(configMap)
    .filter((key) => configMap[key as keyof typeof configMap] === true)
    .join("\n");
  if (!existsSync("../../tmp")) {
    mkdirSync("../../tmp");
  }
  writeFileSync("../../tmp/deployment.txt", configOutput);
  console.log("Deployment config created.");
};

const command = createCommand(config.id)
  .description(config.description)
  .action(action);

export const createDeploymentConfig: CliCommand = {
  ...config,
  action,
  command,
};
