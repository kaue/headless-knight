const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Reflection = require('./../core/reflection');

class Scope {
	constructor(body, url, queue) {
		const scope = {
			// Native
			eval: () => {
			},
			// Fundamental objects
			Object,
			Function,
			Boolean,
			Symbol,
			Error,
			EvalError,
			RangeError,
			ReferenceError,
			SyntaxError,
			TypeError,
			URIError,
			// Numbers and dates
			Number,
			Math,
			Date,
			// Text processing
			String,
			RegExp,
			// Indexed collections
			Array,
			Int8Array,
			Uint8Array,
			Uint8ClampedArray,
			Int16Array,
			Uint16Array,
			Int32Array,
			Uint32Array,
			Float32Array,
			Float64Array,
			// Structured data
			ArrayBuffer,
			SharedArrayBuffer,
			Atomics,
			DataView,
			JSON,
			// Control abstraction objects
			Promise,
			// Keyed collections
			Map,
			Set,
			WeakMap,
			WeakSet,
			// Reflection
			Reflect,
			Proxy,
			// Function properties
			isFinite,
			isNaN,
			parseFloat,
			parseInt,
			decodeURI,
			decodeURIComponent,
			encodeURI,
			encodeURIComponent,
			escape,
			unescape,
		};
		// Follows https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
		const { window, document } = new JSDOM(body, {
			url,
			referrer: url,
			contentType: 'text/html',
			includeNodeLocations: true,
			storageQuota: 10000000,
		});
		window.document.createElement = Reflection.getInjector(
			// Original
			window.document.createElement,
			(element) => {
				const type = (element.tagName || element.nodeName).toLowerCase();
				if (type !== 'script') {
					return element;
				}
				let elementSrc = element.src;
				Object.defineProperty(element, 'src', {
					get: () => {
						return elementSrc;
					},
					set: async (url) => {
						console.log('\t[createElement] intercepted', url);
						queue.push({ url });
						elementSrc = url;
					},
				});
				return element;
			});
		window.XMLHttpRequest.send = Reflection.getInjector(
			(...args) => {
				console.log('\t[window.XMLHttpRequest.send] intercepted', args);
				return args;
			},
			window.XMLHttpRequest.send || function () {
			});
		window.document.write = Reflection.getInjector(
			(...args) => {
				console.log('\t[window.document.write] intercepted', args);
				// TODO should look for scripts in doc.write
				//queue = queue.concat(parseHTML(args[0]));
				return args;
			}, window.document.write);
		scope.window = Reflection.getProxy({
			matchMedia: (query) => matchMedia(query, {
				'orientation': 'portrait',
				'scan': 'progressive',
				'width': 1920,
				'height': 1080,
				'device-width': 1920,
				'device-height': 1080,
				'resolution': '300 dpi',
				'aspect-ratio': '16/9',
				'device-aspect-ratio': '16/9',
				'device-pixel-ratio': '1/1',
				'grid': 0,
				'color': 256,
				'color-index': 256,
				'monochrome': 256,
			}),
		}, window, scope);
		scope.document = document;
		// MutationObserver currently requires global window to exist
		global.window = Reflection.getProxy({}, window);
		window.MutationObserver = require('mutation-observer');
		return Reflection.getProxy(scope, scope.window);
	}
}

module.exports = Scope;