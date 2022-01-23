import * as core from "@actions/core";
import sourceMapSupport from "source-map-support";

async function main() {
	sourceMapSupport.install();
}

main().catch(error => core.setFailed(error.stack || error));
