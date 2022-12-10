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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache = __importStar(require("./cache"));
const core = __importStar(require("@actions/core"));
const outputs = __importStar(require("./outputs"));
const pythonVersion = __importStar(require("./pythonVersion"));
const source_map_support_1 = __importDefault(require("source-map-support"));
async function main() {
    source_map_support_1.default.install();
    const requiredPythonVersion = await pythonVersion.getPythonVersion();
    core.info(`Python version is ${requiredPythonVersion}.`);
    outputs.set({ "python-version": requiredPythonVersion });
    await cache.restoreCache(requiredPythonVersion);
}
main().catch(error => core.setFailed(error.stack || error));
//# sourceMappingURL=index.js.map