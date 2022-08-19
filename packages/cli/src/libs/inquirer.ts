import inquirer, { PromptModule } from "inquirer";
// @ts-ignore
import inquirerSearchCheckbox from "inquirer-search-checkbox";

const containedInquirer = inquirer.createPromptModule();

containedInquirer.registerPrompt("search-checkbox", inquirerSearchCheckbox);

export const cliPrompt = (...args: Parameters<PromptModule>) =>
  containedInquirer(...args);
