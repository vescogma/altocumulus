import { join } from "node:path";
import { paramCase } from "change-case";
import { renderTemplateFolder, writeRendered } from "./templating.js";
import { isExistingPackage } from "./workspace.js";

export const generatePackage = async (name: string, pathName: string) => {
  const valName = paramCase(name);
  const packageName = `@ac/${valName}`;
  const outPath = join("packages", pathName || '.' , valName);
  console.log(`Generating package ${packageName} at ${outPath}...`);
  if (await isExistingPackage(packageName)) {
    console.log("Package already exists!");
    process.exit(1);
  }
  const templateDate = { packageName };
  const dirPath = join("templates", "package");
  const rendered = await renderTemplateFolder(
    dirPath,
    templateDate,
    (path: string) => path.replace(dirPath, join("..", "..", outPath)),
    (name: string) => name.replace(".ejs", "")
  );
  await writeRendered(rendered);
};
