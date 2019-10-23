/*
This file contains the text that I want to insert as the header comment.

TASKS:
1. Build
	a. For node
	b. For browser
2. Test
	a. All
	b. Select suite(s)
3. Create docs
	a. Into next folder (before commit and release)
	b. Into correct version folder (for release)
4. Minify
5. Add license as header
6. Prepare
	[1, 2a, 3b, 4, 5]
*/

const gulp = require("gulp");
const ts = require("gulp-typescript");
const header = require("gulp-header");
const fs = require("fs");
const browserify = require("browserify");
const minify = require("gulp-minify");
const typedoc = require("gulp-typedoc");

const pkg = require("./package.json");
// const tsconfig = require("tsconfig.json");
const tsProject = ts.createProject("tsconfig.json");

gulp.task("build:node", function() {
	return tsProject.src()
		.pipe(tsProject()).js
		.pipe(gulp.dest("./build"));
});

gulp.task("build:browser", function() {
	return browserify("./release/app.js")
		.bundle()
		.pipe(fs.createWriteStream("./mcalc.js"));
});

gulp.task("minify", function() {
	return gulp.src("./mcalc.js")
		.pipe(minify({
			ext: {
				min: ".min.js"
			},
			noSource: true
		}))
		.pipe(gulp.dest("./"));
});

gulp.task("header", function() {
	const license = fs.readFileSync("LICENSE.txt", "utf8");
	const separator = license.includes("\r\n")? "\r\n": license.includes("\r")? "\r": "\n";
	const data = license.split(separator).map(s => " * " + s + separator);
	data.unshift("/**" + separator);
	data.push(" */" + separator);
	return gulp.src(["./mcalc.js", "./mcalc.min.js"])
		.pipe(header(data.join(""), {
			pkg: pkg
		}))
		.pipe(gulp.dest("./release"));
});

gulp.task("docs:pre", function() {
	return gulp.src(["src/**/*.ts"])
		.pipe(typedoc({
			// TypeScript options (see typescript docs)
			module: tsProject.options.module,
			target: tsProject.options.target,
			lib: tsProject.options.lib,
			includeDeclarations: tsProject.options.declaration,
			// Output options (see typedoc docs)
			out: "./docs/next",
			// TypeDoc options (see typedoc docs)
			name: "multivariate_calculus",
			ignoreCompilerErrors: false,
			entryPoint: "src/index.ts",
			readme: "./README.md",
			mode: "file",
			version: true,
			//verbose: true
		}));
});
