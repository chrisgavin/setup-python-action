import * as cache from "@actions/cache";
import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";
import * as core from "@actions/core";

const packageLockPath = "./poetry.lock";
const cachePaths = [
	"~/.cache/pip/",
	"~/.cache/pypoetry/",
];

async function cacheKey(pythonVersion:string) {
	const hash = crypto.createHash("sha256");	
	hash.update(await fs.promises.readFile(packageLockPath));
	return `python-cache-${os.type()}-${hash.digest("hex")}-${pythonVersion}`;
}

export async function restoreCache(pythonVersion:string):Promise<void> {
	const key = await cacheKey(pythonVersion);
	core.info(`Restoring cache with key ${key}.`);
	await cache.restoreCache(cachePaths, key);
}

export async function saveCache(pythonVersion:string):Promise<void> {
	const key = await cacheKey(pythonVersion);
	core.info(`Saving cache with key ${key}.`);
	try {
		await cache.saveCache(cachePaths, key);
	}
	catch (e) {
		if (e instanceof cache.ReserveCacheError) {
			core.warning(e);
		}
		else {
			throw e;
		}
	}
}
