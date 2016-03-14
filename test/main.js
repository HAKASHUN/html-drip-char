/*global describe, it*/
"use strict";

var fs = require("fs"),
	es = require("event-stream"),
	path = require('path'),
	should = require("should");

var htmlDripChar = require('..');

require("mocha");

delete require.cache[require.resolve("../")];


describe('html-drip-char', function() {

	describe('.fromString()', function() {
		it ('should get unique characters', function () {
			var characters = htmlDripChar.fromString('Starbucks uses the highest quality arabica coffee as the base for its beloved drinks. Learn about our unique coffee makers and cold brew coffee today.');
			should(characters).be.exactly("Starbucksehigqlyofvdn.Lmw");
		});

		it ('should get unique characters with ASCII symbols', function () {
			var characters = htmlDripChar.fromString('&#xA9; 2016 Starbucks Corporation.  All rights reserved.');
			should(characters).be.exactly("©2016StarbucksCopin.Alghevd");
		});

	});

	describe('.fromFile()', function() {
		it('should get unique characters from a file at given path', function(done) {
			var htmlFile = path.join(__dirname, 'test.html');
			htmlDripChar.fromFile(htmlFile, {}, function(err, text) {
				should(text).be.exactly("PargphsAtveocumjdlb.Sikn,LyqGTx1C:69€7%32504wIMJDF8BfE-!(_'){[#]};");
				done()
			});
		});
		it('should work well without options', function(done) {
			var htmlFile = path.join(__dirname, 'test.html');
			htmlDripChar.fromFile(htmlFile, function(err, text) {
				should(text).be.exactly("PargphsAtveocumjdlb.Sikn,LyqGTx1C:69€7%32504wIMJDF8BfE-!(_'){[#]};");
				done()
			});
		});
	});

});
