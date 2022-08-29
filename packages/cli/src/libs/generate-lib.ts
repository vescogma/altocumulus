import { join } from "node:path";
import { paramCase } from "change-case";
import { renderTemplateFolder, writeRendered } from "./templating.js";
import { isExistingPackage } from "./workspace.js";

export const generateLib = async (name: string) => {
  const valName = paramCase(name);
  const packageName = `@ac/${valName}`;
  const outPath = join("packages", "libs", valName);
  console.log(`Generating lib ${packageName} at ${outPath}...`);
  if (await isExistingPackage(packageName)) {
    console.log("Package already exists!");
    process.exit(1);
  }
  const templateDate = { packageName };
  const dirPath = join("templates", "lib");
  const rendered = await renderTemplateFolder(
    dirPath,
    templateDate,
    (path: string) => path.replace(dirPath, join("..", "..", outPath)),
    (name: string) => name.replace(".ejs", "")
  );
  await writeRendered(rendered);
};
