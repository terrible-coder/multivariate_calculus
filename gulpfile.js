const gulp = require("gulp");
const ts = require("gulp-typescript");
const header = require("gulp-header");
const fs = require("fs");
const browserify = require("browserify");
const minify = require("gulp-minify");
const pkg = require("./package.json");

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
	data.push(" */" + separator + separator);
	return gulp.src("./mcalc.js")
		.pipe(header(data.join(""), {
			pkg: pkg
		}))
		.pipe(gulp.dest("./release"));
});