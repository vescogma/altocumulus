import { opendir, writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import ejs from "ejs";

export type RenderedTemplate = { path: string; name: string; file: string };

export const writeRendered = async (rendered: RenderedTemplate[]) => {
  for await (let template of rendered) {
    await mkdir(template.path, { recursive: true });
    await writeFile(join(template.path, template.name), template.file, {
      flag: "wx",
    });
  }
};

export const renderTemplateFolder = async (
  dirPath: string,
  data: any,
  transformPath = (path: string) => path,
  transformName = (name: string) => name
) => {
  const rendered: RenderedTemplate[] = [];
  const dir = await opendir(join(dirPath));
  for await (let entry of dir) {
    const entryPath = join(dir.path, entry.name);
    if (entry.isDirectory()) {
      const subDir = await renderTemplateFolder(
        entryPath,
        data,
        transformPath,
        transformName
      );
      rendered.push(...subDir);
    } else {
      const path = transformPath(dir.path);
      const name = transformName(entry.name);
      const file = await renderTemplate(entryPath, data);
      rendered.push({ path, name, file });
    }
  }
  return rendered;
};

export const renderTemplate = async (fileName: string, data: any) => {
  const template = await readFile(fileName);
  return ejs.render(template.toString(), data);
};
