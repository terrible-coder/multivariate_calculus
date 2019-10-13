const gulp = require("gulp");
const ts = require("gulp-typescript");
const fs = require("fs");
const browserify = require("browserify");
const minify = require("gulp-minify");

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