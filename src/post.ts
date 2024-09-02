import * as cache from "./cache.js";
import * as core from "@actions/core";
import * as pythonVersion from "./pythonVersion.js";
import sourceMapSupport from "source-map-support";

async function main() {
	sourceMapSupport.install();
	await cache.saveCache(await pythonVersion.getPythonVersion());
}

main().catch(error => core.setFailed(error.stack || error));
