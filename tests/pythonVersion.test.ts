import * as sinon from "sinon";

import * as inputs from "../src/inputs";
import * as pythonVersion from "./../src/pythonVersion";

class TestInputs implements inputs.Inputs {
	"python-version-path" = "./tests/fixtures/python-version.txt";
}

describe("test getPythonVersion(...)", () => {
	it("should return the correct Python version", async () => {
		sinon.stub(inputs, "get").returns(new TestInputs());
		await pythonVersion.getPythonVersion();
		expect(await pythonVersion.getPythonVersion()).toEqual("3.6.9");
	});
});
