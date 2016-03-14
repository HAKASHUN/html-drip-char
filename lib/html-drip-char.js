var fs = require('fs'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	he = require('he'),
	htmlparser = require('htmlparser');

var SKIP_TYPES = [
	'style',
	'script'
];

function htmlDripChar(html, options) {
	options = options || {};

	var handler = new htmlparser.DefaultHandler(function(error, dom) {

	}, {
		verbose: true,
		ignoreWhitespace: true
	});

	new htmlparser.Parser(handler).parseComplete(html);
	var beans = grinder(handler.dom);
	var dripped = dripper(beans, options);
	return pouring(dripped);
}

function pouring(dripped) {
	var result = dripped.replace(/\s+/g, '');
	return _.uniq(_s.chop(result, 1)).join('');
}

function grinder(dom) {
	var result = null;
	function execute(dom) {
		if (result) return;
		_.each(dom, function(elem) {
			if (elem.name === 'body') {
				result = elem.children;
				return;
			}
			elem.children && grinder(elem.children);
		});
	}
	execute(dom);
	return result || dom;
}

function dripper(dom, options, result) {
	if (arguments.length < 3) {
		result = '';
	}
	_.forEach(dom, function(elem) {
		switch(elem.type) {
			case 'tag':
				result += tagDripper(elem, options, result);
				break;
			case 'text':
				result += textDripper(elem, options, result);
				break;
			default:
				if (!_.include(SKIP_TYPES, elem.type)) {
					result += dripper(elem.children || [], options, result);
				}
				break;
		}
	});

	return result;
}

function tagDripper(dom, options) {
	return dripper(dom.children, options);
}

function textDripper(dom, options) {
	var result = _s.strip(dom.raw);
	return he.decode(result);
}

exports.fromFile = function(file, options, callback) {

	if (arguments.length < 3) {
		callback = options;
		options = {};
	}

	fs.readFile(file, 'utf8', function(err, str) {
		var result = htmlDripChar(str, options);
		return callback(null, result);
	});
};

exports.fromString = function(str, options) {
	return htmlDripChar(str, options || {});
};
