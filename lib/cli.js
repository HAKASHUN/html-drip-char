#!/usr/bin/env node

var HtmlDripChar = require('./html-drip-char'),
	path = require('path');

module.exports = function(program) {

	var target = program.args[0];
	var src = path.resolve(process.cwd() + '/', target);
	HtmlDripChar.fromFile(src)
};
