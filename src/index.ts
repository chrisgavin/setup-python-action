import * as cache from "./cache.js";
import * as core from "@actions/core";
import * as outputs from "./outputs.js";
import * as pythonVersion from "./pythonVersion.js";
import sourceMapSupport from "source-map-support";

async function main() {
	sourceMapSupport.install();

	const requiredPythonVersion = await pythonVersion.getPythonVersion();
	core.info(`Python version is ${requiredPythonVersion}.`);
	outputs.set({"python-version": requiredPythonVersion});

	await cache.restoreCache(requiredPythonVersion);
}

main().catch(error => core.setFailed(error.stack || error));
