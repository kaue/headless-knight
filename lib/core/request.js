const request = require('request-promise');
const cheerio = require('cheerio');

class Request {
	constructor() {

	}

	/**
	 * Uses request module to get URL content
	 * @param url
	 * @returns {*}
	 */
	static get(url) {
		url = url.startsWith('//') ? 'https:' + url : url;
		console.log('get(%s)', url);
		return request({
			url,
			gzip: true,
		});
	}

	/**
	 * Parses HTML using cheerio, looks for inline / external scripts
	 * @param html
	 * @returns {Array}
	 */
	static parse(html) {
		const scripts = [];
		const $ = cheerio.load(html);
		// Check each script tag
		$('script').each((index, script) => {
			// External scripts
			if (script.attribs &&
				script.attribs.src) {
				return scripts.push({
					url: script.attribs.src,
				});
			}
			if(script.attribs &&
				script.attribs.type &&
				script.attribs.type !== 'text/javascript') {
				return;
			}
			// Inline scripts
			const code = script.children.map(children => children.data || '').join('');
			if (!code) {
				return;
			}
			scripts.push({
				code,
			});
		});
		return scripts;
	}
}

module.exports = Request;