import { program } from "commander";
import { cliPrompt } from "./libs/inquirer.js";
import * as cliCommands from "./commands/index.js";
import { CliCommand } from "./libs/typings.js";

type CliCommandKey = keyof typeof cliCommands;

program.name("@ac/cli").description("The cli for all the things!");

for (let key in cliCommands) {
  const command = cliCommands[key as CliCommandKey].command;
  if (command) {
    program.addCommand(command);
  }
}

const cliRootAction = async () => {
  const commandKeys = Object.keys(cliCommands) as CliCommandKey[];
  const choices = commandKeys
    .filter((key) => typeof cliCommands[key].action === "function")
    .map((key) => ({
      value: cliCommands[key].id,
      short: cliCommands[key].title,
      name: `${cliCommands[key].title} -- ${cliCommands[key].description}`,
    }));
  const answers = await cliPrompt([
    {
      type: "list",
      name: "root",
      message: "The cli for all the things!\n\nWhat would you like to do?",
      choices,
    },
  ]);
  const commandMap = commandKeys.reduce<{ [key: string]: CliCommand }>(
    (acc, key) => ({ ...acc, [cliCommands[key].id]: cliCommands[key] }),
    {}
  );
  await commandMap[answers["root"]].action?.();
  console.log(`Command: ${answers["root"]} executed.`);
};

program.action(cliRootAction);

program.parseAsync();
