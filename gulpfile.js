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

const argv = require("yargs").argv;
const gulp = require("gulp");
const ts = require("gulp-typescript");
const header = require("gulp-header");
const fs = require("fs");
const browserify = require("browserify");
const minify = require("gulp-minify");
const typedoc = require("gulp-typedoc");
const clean = require("gulp-clean");
const jest = require("gulp-jest").default;

const pkg = require("./package.json");
const jestconfig = require("./jest.config");
const tsProject = ts.createProject("tsconfig.json");

function clear(path) {
	return function(cb) {
		if(fs.existsSync(path))
			return gulp.src(path, {read: false})
				.pipe(clean());
		console.log("Directory already clean.");
		cb();
	}
}

function testOnly(config) {
	return Object.assign({
		testNamePattern: argv.t || argv.testNamePattern,
		runInBand: argv.i || argv.runInBand
	}, config);
}

module.exports = {
	build_node: (() => {
			function f() {
				return tsProject.src()
					.pipe(tsProject()).js
					.pipe(gulp.dest("./build"));
			}
			f.displayName = "build:node";
			return f;
		})(),
	build_browser: (() => {
			function f() {
				return browserify("./release/app.js")
					.bundle()
					.pipe(fs.createWriteStream("./mcalc.js"));
			}
			f.displayName = "build:browser";
			return f;
		})(),
	minify: (() => {
			function f() {
				return gulp.src("./mcalc.js")
					.pipe(minify({
						ext: {
							min: ".min.js"
						},
						noSource: true
					}))
					.pipe(gulp.dest("./"));
			}
			f.displayName = "minify";
			return f;
		})(),
	header: (() => {
			function f() {
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
			}
			f.displayName = "header";
			return f;
		})(),
	docsPreRelease: (() => {
			const f = gulp.series([clear("docs/next"), function () {
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
						version: true
					}));
			}]);
			f.displayName = "docs:pre"
			return f;
		})(),
	testAll: (() => {
			function f() {
				return gulp.src("tests")
					.pipe(jest(jestconfig))
			}
			f.displayName = "test:all";
			return f;
		})(),
	testOnly: (() => {
			function f() {
				return gulp.src("tests")
					.pipe(jest(testOnly(jestconfig)))
			}
			f.displayName = "test:only";
			return f;
		})()
}