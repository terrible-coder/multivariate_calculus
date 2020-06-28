const typedoc = require("typedoc");
const pkg = require("../package.json");

const minorVersion = pkg.version.split(".").slice(0, 2).join(".");

const app = new typedoc.Application();
app.options.addReader(new typedoc.TSConfigReader());

const stable = /^\d+.\d+.\d+$/;
let outDir;

if(pkg.version.match(stable) !== null)
	outDir = "./docs";
else outDir = "./docs/next";

app.bootstrap({
	mode: "file",
	logger: "none",
	module: "CommonJS",
	theme: "./theme",
	stripInternal: true,
	disableOutputCheck: true
});
const project = app.convert(app.expandInputFiles(["./src"]));

if(project) {
	app.generateDocs(project, outDir);
	app.generateDocs(project, `./docs/${minorVersion}`);
}
else
	throw new Error("Something went wrong.");