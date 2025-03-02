// @ts-ignore
import Packager from "@turbowarp/packager";
import { $ } from "bun";
import FS from "fs/promises";

await $`
python prebuild.py
./goboscript build
`;

const projectData = await FS.readFile("gsbounce.sb3");

function progressCallback(type: any, a: any, b: any) {}

const loadedProject = await Packager.loadProject(projectData, progressCallback);

const packager = new Packager.Packager();
packager.project = loadedProject;

const result = await packager.package();

await FS.mkdir("_site", { recursive: true });
await FS.writeFile("_site/index.html", result.data);
