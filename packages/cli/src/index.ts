import { program } from "commander";
import * as cliCommands from "./commands/index.js";
import { rootCommand } from "./libs/root-command.js";

program.name("@ac/cli").description("🚀 Welcome to the cli for all the things!");

program.addCommand(rootCommand, { isDefault: true, hidden: true });

for (let cliCommand of Object.values(cliCommands)) {
  if (cliCommand.command) {
    program.addCommand(cliCommand.command);
  }
}

program.parseAsync();
