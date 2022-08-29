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
  title: "🚢 Deploy cloud functions",
  description: "choose cloud functions to deploy locally",
};

const action = async () => {
  const packageNames = await getAllPackageNames();
  const answers = await cliPrompt([
    {
      type: "list",
      name: "groupSelection",
      message: "Which functions would you like to deploy?",
      choices: [
        { name: "All the functions! 🧹🤪✊", value: "all" },
        { name: "Affected 👌😌", value: "affected" },
        { name: "Let me pick 🙏", value: "interactive" },
      ],
    },
    {
      type: "search-checkbox",
      name: "pkgNames",
      message: "Pick 'em.",
      choices: packageNames.map((key) => ({ name: key, value: key })),
      when: (answers) => answers.groupSelection === "interactive",
    },
  ]);
  await deploy(answers.groupSelection, answers.pkgNames);
};

const EXAMPLES_TEXT = `
Examples:
  Deploy 2 functions of your choice:
  $ ... deploy-cloud-function -p @ac/pkg-name-1 @ac/pkg-name-2
`;

const command = createCommand(config.id)
  .description(config.description)
  .addHelpText("after", EXAMPLES_TEXT)
  .option("-a, --all", "deploy all functions")
  .option("-A, --affected", "deploy only affected functions")
  .option("-p, --packages <string...>", "deploy chosen functions")
  .action(async (options) => {
    if (Object.values(options).length < 1) {
      await action();
    } else if (options.affected) {
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
      const packageNames = await getAllPackageNames();
      toDeploy.push(...packageNames);
    } else if (selectedGroup === "affected") {
      const affectedPackageNames = await getAffectedPackageNames();
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
