const shell = require("shelljs")
const pkg = require("../package.json");

shell.exec(`echo Uploading to version ${pkg.version}`);
const prerelease = /\d+.\d+.\d+-(?<preid>\w+).\d+/;
const latest = /\d+\.\d+\.\d+(?<rest>.*)/;
let tag = "";

let match = pkg.version.match(prerelease);
if(match !== null)
	tag = match.groups.preid;
else if((match = pkg.version.match(latest)) !== null)
	if(match.groups.rest === "")
		tag = "latest";
else {
	shell.exec("echo Package version invalid. Cannot publish.");
	shell.exit(1);
}

shell.exec(`echo Adding tag ${tag}`);
shell.exec(`npm publish --tag ${tag}`);
shell.exec("echo Published.");