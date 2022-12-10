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

async function cachePaths():Promise<string[]> {
	switch (process.platform) {
		case "linux": {
			return [
				"~/.cache/pip/",
				"~/.cache/pypoetry/",
			];
		}
		case "darwin": {
			return [
				"~/Library/Caches/pip/",
				"~/Library/Caches/pypoetry/",
			];
		}
		case "win32": {
			return [
				"~/AppData/Local/pip/Cache/",
				"~/AppData/Local/pypoetry/Cache/",
			];
		}
		default: {
			core.info(`No cache paths known for platform ${process.platform}.`);
			return [];
		}
	}
}

async function cacheKey(pythonVersion:string) {
	const hash = crypto.createHash("sha256");	
	hash.update(await fs.promises.readFile(packageLockPath));
	return `python-cache-${os.type()}-${hash.digest("hex")}-${pythonVersion}`;
}

export async function restoreCache(pythonVersion:string):Promise<void> {
	const paths = await cachePaths();
	if (paths.length === 0) {
		return;
	}
	const key = await cacheKey(pythonVersion);
	core.info(`Restoring cache with key ${key}.`);
	await cache.restoreCache(paths, key);
}

export async function saveCache(pythonVersion:string):Promise<void> {
	const paths = await cachePaths();
	if (paths.length === 0) {
		return;
	}
	const key = await cacheKey(pythonVersion);
	core.info(`Saving cache with key ${key}.`);
	try {
		await cache.saveCache(paths, key);
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
