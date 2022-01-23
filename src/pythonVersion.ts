import * as fs from "fs";
import * as inputs from "./inputs";

export async function getPythonVersion():Promise<string> {
	const contents = await fs.promises.readFile(inputs.get()["python-version-path"], "utf8");
	return contents.trim();
}
