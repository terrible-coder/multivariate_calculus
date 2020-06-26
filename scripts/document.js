const typedoc = require("typedoc");
const pkg = require("../package.json");

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
	stripInternal: true
});
const project = app.convert(app.expandInputFiles(["./src"]));

if(project)
	app.generateDocs(project, outDir);
else
	console.log("Something went wrong.");