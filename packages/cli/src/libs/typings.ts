import { Command } from "commander";

export type CliCommand = {
  id: string;
  title: string;
  description: string;
  /** root cli action that will be called by the top `inquirer` prompt result */
  action?: () => Promise<void>;
  command?: Command;
};
