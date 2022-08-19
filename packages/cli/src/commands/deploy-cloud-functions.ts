import { createCommand } from "commander";
import {
  deployConcurrently,
  getAffectedPackageNames,
  getAllPackageNames,
  pruneCloudFunctionPackage,
} from "../libs/cloud-function-deployment.js";
import { cliPrompt } from "../libs/inquirer.js";
import { CliCommand } from "../libs/typings.js";

const config = {
  id: "deploy-cloud-functions",
  title: "🚢 Deploy cloud functions.",
  description: "Choose cloud functions to deploy locally.",
};

const action = async () => {
  const packageNames = getAllPackageNames();
  const answers = await cliPrompt([
    {
      type: "list",
      name: "groupSelection",
      message: "Which functions would you like to deploy?",
      choices: [
        { name: "All the functions! 🧹🤪✊", value: "all" },
        { name: "Affected 👌😌👌", value: "affected" },
        { name: "Let me pick 🙏", value: "interactive" },
      ],
    },
    {
      type: "search-checkbox",
      name: "cloudFunctions",
      message: "Pick 'em.",
      choices: packageNames.map((key) => ({ name: key, value: key })),
      when: (answers) => answers.groupSelection === "interactive",
    },
  ]);
  await deploy(answers.groupSelection, answers.cloudFunctions);
};

const EXAMPLES_TEXT = `
Examples:
  Deploy 2 functions of your choice:
  $ ... deploy-cloud-function -p @ac/pkg-name-1 @ac/pkg-name-2
`;

const command = createCommand(config.id)
  .description(`${config.description} Defaults to "affected".`)
  .addHelpText("after", EXAMPLES_TEXT)
  .option("-a, --all", "Deploy all functions.")
  .option("-A, --affected", "Deploy only affected functions.")
  .option("-p, --packages <string...>", "Deploy chosen functions.")
  .action(async (options) => {
    if (options.affected || Object.values(options).length < 1) {
      await deploy("affected");
    } else if (options.all) {
      await deploy("all");
    } else if (options.packages) {
      const selected = options.packages.filter(
        (key: string) => key.match("@ac") !== null
      );
      await deploy(null, selected);
    }
  });

export const deployCloudFunctions: CliCommand = {
  ...config,
  action,
  command,
};

const deploy = async (
  selectedGroup: string | null,
  selectedPackageNames?: string[]
) => {
  const toDeploy = [];
  if ((selectedPackageNames ?? []).length > 0) {
    toDeploy.push(...selectedPackageNames!);
  } else {
    if (selectedGroup === "all") {
      const packageNames = getAllPackageNames();
      toDeploy.push(...packageNames);
    } else if (selectedGroup === "affected") {
      const affectedPackageNames = getAffectedPackageNames();
      toDeploy.push(...affectedPackageNames);
    }
  }
  if (toDeploy.length > 0) {
    for (let pkgName of toDeploy) {
      pruneCloudFunctionPackage(pkgName);
    }
    await deployConcurrently(toDeploy);
    console.log("Cloud functions deployed.");
  } else {
    console.log("No cloud functions deployed.");
  }
};
