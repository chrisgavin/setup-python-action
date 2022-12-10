import * as cache from "@actions/cache";
import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";
import * as core from "@actions/core";

const packageLockPath = "./poetry.lock";

async function cachePaths(existingOnly:boolean):Promise<string[]> {
	let paths:string[] = [];
	switch (process.platform) {
		case "linux": {
			const cacheDirectory = process.env.XDG_CACHE_HOME || `${os.homedir()}/.cache/`;
			paths = [
				`${cacheDirectory}/pip/`,
				`${cacheDirectory}/pypoetry/`,
			];
			break;
		}
		case "darwin": {
			const cacheDirectory = `${os.homedir()}/Library/Caches/`;
			paths = [
				`${cacheDirectory}/pip/`,
				`${cacheDirectory}/pypoetry/`,
			];
			break;
		}
		case "win32": {
			const appDataLocalDirectory = process.env.LOCALAPPDATA || `${os.homedir()}/AppData/Local/`;
			paths = [
				`${appDataLocalDirectory}/pip/Cache/`,
				`${appDataLocalDirectory}/pypoetry/Cache/`,
			];
			break;
		}
		default: {
			core.info(`No cache paths known for platform ${process.platform}.`);
		}
	}

	if (!existingOnly) {
		return paths;
	}

	return paths.filter(async (path) => {
		const exists = await fs.promises.access(path).then(() => true).catch(() => false);
		if (!exists) {
			core.warning(`Path ${path} does not exist so it will not be cached.`);
		}
		return exists;
	});
}

async function cacheKey(pythonVersion:string) {
	const hash = crypto.createHash("sha256");	
	hash.update(await fs.promises.readFile(packageLockPath));
	return `python-cache-${os.type()}-${hash.digest("hex")}-${pythonVersion}`;
}

export async function restoreCache(pythonVersion:string):Promise<void> {
	const paths = await cachePaths(false);
	if (paths.length === 0) {
		return;
	}
	const key = await cacheKey(pythonVersion);
	core.info(`Restoring cache with key ${key}.`);
	await cache.restoreCache(paths, key);
}

export async function saveCache(pythonVersion:string):Promise<void> {
	const paths = await cachePaths(true);
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
