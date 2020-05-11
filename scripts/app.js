const mcalc = require("../build/index");

const keys = Object.keys(mcalc);
for(let i = 0; i < keys.length; i++)
	window[keys[i]] = mcalc[keys[i]];