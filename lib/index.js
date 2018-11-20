const Request = require('./core/request');
const Scope = require('./vm/scope');
const VM = require('./vm/core');
module.exports = async function(url) {
	console.time('full');
	let queue = [];
	(async () => {
		const body = await Request.get(url);
		const scope = new Scope(body, url, queue);
		queue = queue.concat(Request.parse(body));
		let item;
		while (item = queue.shift()) {
			item.url = /^((https?:)?\/\/)/.test(item.url) ? item.url : url + item.url;
			const code = item.code || await get(item.url);
			if (!code) {
				console.error(new Error('Missing code'), item);
			}
			const output = new VM(code, scope);
			// Extra 1 sec for late events
			if (queue.length === 0) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
		scope.window.close();
		console.timeEnd('full');
	})();
};