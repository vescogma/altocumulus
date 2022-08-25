import { createCommand } from "commander";
import { cliPrompt } from "../libs/inquirer.js";
import { CliCommand } from "../libs/typings.js";

const config = {
  id: "generate",
  title: "🐣 Generate",
  description: "generate a monorepo component",
};

const action = async () => {
  const answers = await cliPrompt([
    {
      type: "list",
      name: "generator",
      message: "What do you want to generate?",
      choices: [
        { name: "Cloud function", value: "gcf" },
        { name: "Lib", value: "lib" },
      ],
    },
  ]);

  console.log("generate thing", answers);
};

const command = createCommand(config.id)
  .description(config.description)
  .option("-f, --function", "generate a new cloud function")
  .option("-l, --lib", "generate a new lib")
  .action(async (options) => {
    if (Object.values(options).length < 1) {
      await action();
    } else if (options.function) {
      console.log("generate fn");
    } else if (options.lib) {
      console.log("generate lib");
    }
  });

export const generate: CliCommand = {
  ...config,
  action,
  command,
};
