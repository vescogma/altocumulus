import inquirer, { Answers } from "inquirer";
// @ts-ignore
import inquirerSearchCheckbox from "inquirer-search-checkbox";

const containedInquirer = inquirer.createPromptModule();

containedInquirer.registerPrompt("search-checkbox", inquirerSearchCheckbox);

export const cliPrompt = <T extends Answers>(
  ...args: Parameters<typeof containedInquirer<T>>
) => containedInquirer<T>(...args);
