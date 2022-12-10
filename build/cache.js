"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCache = exports.restoreCache = void 0;
const cache = __importStar(require("@actions/cache"));
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const core = __importStar(require("@actions/core"));
const packageLockPath = "./poetry.lock";
const cachePaths = [
    "~/.cache/pip/",
    "~/.cache/pypoetry/",
];
async function cacheKey(pythonVersion) {
    const hash = crypto.createHash("sha256");
    hash.update(await fs.promises.readFile(packageLockPath));
    return `python-cache-${os.type()}-${hash.digest("hex")}-${pythonVersion}`;
}
async function restoreCache(pythonVersion) {
    const key = await cacheKey(pythonVersion);
    core.info(`Restoring cache with key ${key}.`);
    await cache.restoreCache(cachePaths, key);
}
exports.restoreCache = restoreCache;
async function saveCache(pythonVersion) {
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
exports.saveCache = saveCache;
//# sourceMappingURL=cache.js.map