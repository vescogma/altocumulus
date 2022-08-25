import { createCommand } from "commander";
import { cliPrompt } from "./inquirer.js";
import { CliCommand } from "./typings.js";
import * as cliCommands from "../commands/index.js";

type CliCommandKey = keyof typeof cliCommands;

export const rootCommand = createCommand("welcome")
  .action(async () => {
    const commandKeys = Object.keys(cliCommands) as CliCommandKey[];
    const commandMap = commandKeys.reduce<{ [key: string]: CliCommand }>(
      (acc, key) => ({ ...acc, [cliCommands[key].id]: cliCommands[key] }),
      {}
    );
    const choices = commandKeys
      .filter((key) => typeof cliCommands[key].action === "function")
      .map((key) => ({
        value: cliCommands[key].id,
        short: cliCommands[key].title,
        name: `${cliCommands[key].title} (${cliCommands[key].id}) - ${cliCommands[key].description}`,
      }));
    console.log('\n🚀 Welcome to the cli for all the things!\n')
    const answers = await cliPrompt([
      {
        type: "list",
        name: "root",
        message: "What would you like to do?",
        choices,
      },
    ]);
    await commandMap[answers["root"]].action?.();
    console.log(`Command: ${answers["root"]} executed.`);
  });
