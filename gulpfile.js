const gulp = require("gulp");
const ts = require("gulp-typescript");
const fs = require("fs");
const browserify = require("browserify");
const jest = require("jest/node_modules/jest-cli");

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
