import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context);
  const name = specifier.slice(2);
  const root = fileURLToPath(new URL("../src/", import.meta.url));
  const suffixes = ["", ".ts", ".tsx", ".mjs", "/index.ts"];
  for (const suffix of suffixes) {
    const file = `${root}${name}${suffix}`;
    if (!existsSync(file)) continue;
    return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(new URL(`../src/${name}.ts`, import.meta.url).href, context);
}
