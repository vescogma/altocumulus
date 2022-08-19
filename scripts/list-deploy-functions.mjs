import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const main = async () => {
  if (!existsSync("./tmp")) {
    mkdirSync("./tmp");
  }
  execSync(`yarn --silent list:affected > ./tmp/list-affected.txt`);
  execSync(`yarn --silent workspaces info > ./tmp/workspaces-info.txt`);

  const affectedOutput = readFileSync("./tmp/list-affected.txt").toString();
  const listAffected = JSON.parse(
    affectedOutput.slice(affectedOutput.indexOf("{\n"))
  );
  const affectedMap = listAffected.packages.reduce(
    (acc, pkgKey) => ({ ...acc, [pkgKey]: true }),
    {}
  );
  const infoOutput = readFileSync("./tmp/workspaces-info.txt").toString();
  const workspacesInfo = JSON.parse(
    infoOutput.slice(infoOutput.indexOf("{\n"))
  );
  const matchingWorkspaces =
    Object.keys(workspacesInfo)
      .filter(
        (pkgKey) =>
          workspacesInfo[pkgKey].location.match("apps/functions/") !== null &&
          affectedMap[pkgKey]
      )
      .join("\n") + "\n";
  console.log(`functions-to-deploy:\n${matchingWorkspaces}`);
  writeFileSync("./tmp/functions-to-deploy.txt", matchingWorkspaces);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
