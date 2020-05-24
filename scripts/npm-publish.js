const shell = require("shelljs")
const pkg = require("../package.json");

console.log(`uploading to version ${pkg.version}`);
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

const command = `npm publish --tag ${tag}`;
shell.exec(`echo ${command}`);
shell.exec("echo Can publish.");