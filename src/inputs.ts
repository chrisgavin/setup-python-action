import * as core from "@actions/core";

export class Inputs {
	"python-version-path" = core.getInput("python-version-path", {required: true});
}

export function get():Inputs {
	return new Inputs();
}
