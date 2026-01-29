import { describe, it, expect, vi, beforeEach } from "vitest";

import * as pythonVersion from "./../src/pythonVersion";

vi.mock("../src/inputs", () => ({
	get: vi.fn(() => ({
		"python-version-path": "./tests/fixtures/python-version.txt",
	})),
}));

describe("test getPythonVersion(...)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return the correct Python version", async () => {
		expect(await pythonVersion.getPythonVersion()).toEqual("3.6.9");
	});
});
