import { join } from "node:path";
import { camelCase, paramCase } from "change-case";
import { renderTemplateFolder, writeRendered } from "./templating.js";
import { isExistingPackage } from "./workspace.js";

export const generateGcf = async (domain: string, name: string) => {
  const valDomain = paramCase(domain);
  const valName = paramCase(name);
  const functionName = buildFunctionName(valDomain, valName);
  const packageName = buildPackageName(valDomain, valName);
  const entryPoint = buildEntryPoint(valDomain, valName);
  const outPath = join("apps", "functions", valDomain, valName);
  console.log(`Generating function ${packageName} at ${outPath}...`);
  if (await isExistingPackage(packageName)) {
    console.log("Package already exists!");
    process.exit(1);
  }
  const templateDate = {
    functionName,
    packageName,
    entryPoint,
  };
  const dirPath = join("templates", "function");
  const rendered = await renderTemplateFolder(
    dirPath,
    templateDate,
    (path: string) => path.replace(dirPath, join("..", "..", outPath)),
    (name: string) => name.replace(".ejs", "")
  );
  await writeRendered(rendered);
};

export const buildFunctionName = (domain: string, name: string) =>
  `${domain}--${name}`;

export const buildPackageName = (domain: string, name: string) =>
  `@ac/${buildFunctionName(domain, name)}`;

export const buildEntryPoint = (domain: string, name: string) =>
  camelCase(`${domain}-${name}`);
