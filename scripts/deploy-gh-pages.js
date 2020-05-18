const ghpages = require("gh-pages");

ghpages.clean();
ghpages.publish("docs", {
	silent: true,
	dotfiles: true,
	add: true,
	user: {
		name: "Ayanava De",
		email: "ayanavade01@gmail.com"
	},
	repo: `https://${process.env.GH_TOKEN}@github.com/terrible-coder/multivariate_calculus`,
}, err => {
	if(err !== undefined) {
		console.log("Something went wrong.");
		console.error(err);
	} else console.log("Published.");
});