import * as cache from "./cache";
import * as core from "@actions/core";
import * as pythonVersion from "./pythonVersion";
import sourceMapSupport from "source-map-support";

async function main() {
	sourceMapSupport.install();
	await cache.saveCache(await pythonVersion.getPythonVersion());
}

main().catch(error => core.setFailed(error.stack || error));
