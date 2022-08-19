import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const TEMPLATE = `version: 2.1

orbs: 
  node: circleci/node@5.0.2

workflows:
  main-workflow:
    jobs:
      - echo:
          matrix:
            parameters:
              function-name: [replacemeyo]

jobs:
  echo:
    parameters:
      function-name:
        type: string
    docker:
      - image: cimg/node:lts
    steps:
      - checkout
      - node/install-packages:
          pkg-manager: yarn
      - run:
          command: yarn echo << parameters.function-name >>

`;

const main = async () => {
  const fnsToDeploy = readFileSync("./tmp/functions-to-deploy.txt").toString();
  const paramList = fnsToDeploy.split("\n").join(",");
  const dynamicConfig = TEMPLATE.replace("replacemeyo", paramList);
  if (!existsSync(".circleci/generated")) {
    mkdirSync(".circleci/generated");
  }
  writeFileSync(".circleci/generated/generated_config.yml", dynamicConfig);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
