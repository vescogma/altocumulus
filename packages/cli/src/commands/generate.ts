import { createCommand } from "commander";
import { cliPrompt } from "../libs/inquirer.js";
import { CliCommand } from "../libs/typings.js";
import { generateGcf } from "../libs/generate-gcf.js";
import { generateLib } from "../libs/generate-lib.js";
import { generatePackage } from "../libs/generate-package.js";

const config = {
  id: "generate",
  title: "🐣 Generate",
  description: "generate a monorepo component",
};

const action = async () => {
  const { generator } = await promptGenerator();
  switch (generator) {
    case "gcf-http": {
      const { domain, name } = await promptGcf();
      await generateGcf(domain, name);
      break;
    }
    case "gcf-pubsub": {
      const { domain, name, topic } = await promptGcf(true);
      await generateGcf(domain, name, topic);
      break;
    }
    case "lib": {
      const { name } = await promptLib();
      await generateLib(name);
      break;
    }
    case "package": {
      const { name, pathName } = await promptPackage();
      await generatePackage(name, pathName);
      break;
    }
  }
};

const gcfHttpSubCommand = createCommand("gcf-http")
  .description("generate a new http cloud function")
  .option("-n, --name <string>", "function name")
  .option("-d, --domain <string>", "function domain")
  .action(async (options) => {
    if (Object.values(options).length < 1) {
      const { domain, name } = await promptGcf();
      await generateGcf(domain, name);
    } else {
      await generateGcf(options.domain, options.name);
    }
  });

const gcfPubsubCommand = createCommand("gcf-pubsub")
  .description("generate a new pub/sub cloud function")
  .option("-n, --name <string>", "function name")
  .option("-d, --domain <string>", "function domain")
  .option("-t, --topic <string>", "trigger pub/sub topic")
  .action(async (options) => {
    if (Object.values(options).length < 1) {
      const { domain, name, topic } = await promptGcf(true);
      await generateGcf(domain, name, topic);
    } else {
      await generateGcf(options.domain, options.name);
    }
  });

const libSubCommand = createCommand("lib")
  .description("generate a new lib")
  .option("-n, --name <string>", "lib name")
  .action(async (options) => {
    if (Object.values(options).length < 1) {
      const { name } = await promptLib();
      await generateLib(name);
    } else {
      await generateLib(options.name);
    }
  });

const packageSubCommand = createCommand("package")
  .description("generate a new package")
  .option("-n, --name <string>", "package name")
  .option(
    "-p, --pathName <string>",
    "packages/path/to/NAME (defaults to packages/NAME)"
  )
  .action(async (options) => {
    if (Object.values(options).length < 1) {
      const { name, pathName } = await promptPackage();
      await generatePackage(name, pathName);
    } else {
      await generatePackage(options.name, options.pathName);
    }
  });

const command = createCommand(config.id)
  .description(config.description)
  .addCommand(gcfHttpSubCommand)
  .addCommand(gcfPubsubCommand)
  .addCommand(libSubCommand)
  .addCommand(packageSubCommand)
  .action(action);

export const generate: CliCommand = {
  ...config,
  action,
  command,
};

const promptGenerator = () =>
  cliPrompt<{ generator: string }>([
    {
      type: "list",
      name: "generator",
      message: "What do you want to generate?",
      choices: [
        {
          name: "☁️  Http GCF - function triggered by an http event",
          value: "gcf-http",
        },
        {
          name: "📻 Pub/Sub GCF - function triggered by a pub/sub event",
          value: "gcf-pubsub",
        },
        {
          name: "📚 Lib - shared business logic (packages/libs/)",
          value: "lib",
        },
        { name: "📦 Package - general shareable module", value: "package" },
      ],
    },
  ]);

const promptGcf = (pubsubTopic?: boolean) =>
  cliPrompt<{ domain: string; name: string; topic: string }>([
    {
      type: "input",
      name: "name",
      message: "What is your function's name?",
    },
    {
      type: "input",
      name: "domain",
      message: (answers) =>
        `What domain should we use (apps/functions/DOMAIN/${answers.name})?`,
    },
    ...(pubsubTopic
      ? [
          {
            type: "input",
            name: "topic",
            message: "What topic should the function trigger on?",
          },
        ]
      : []),
  ]);

const promptLib = () =>
  cliPrompt<{ name: string }>([
    {
      type: "input",
      name: "name",
      message: "What is your lib's name (packages/libs/NAME)?",
    },
  ]);

const promptPackage = () =>
  cliPrompt<{ name: string; pathName: string }>([
    {
      type: "input",
      name: "name",
      message: "What is your package's name?",
    },
    {
      type: "input",
      name: "pathName",
      message: (answers) =>
        `What path should we use (packages/PATH/${answers.name})?\n  Defaults to root level.`,
    },
  ]);
