class Reflection {
	/**
	 * Creates a Proxy that uses all scopes
	 * 	the first is scope is considered the mainScope
	 * @param scopes
	 * @returns {*}
	 */
	static getProxy(...scopes) {
		if (scopes.length < 2) {
			throw new Error('Proxy should be called with at least 2 scopes');
		}
		const [mainScope] = scopes;
		return new Proxy(mainScope, {
			get: function (target, name) {
				for (const scope of [target].concat(scopes)) {
					if (scope[name] != null) {
						return scope[name];
					}
				}
				return undefined;
			},
			set: function (obj, prop, value) {
				obj[prop] = value;
				return true;
			},
		});
	}
	/**
	 * Call each pipeline function in sequence (always apply return as next func args)
	 * @param pipeline
	 * @returns {function(...[*]): *[]}
	 */
	static getInjector(...pipeline) {
		return function (...args) {
			let result = args;
			for (const index in pipeline) {
				const handler = pipeline[index];
				if (!(result instanceof Array)) {
					result = [result];
				}
				result = handler.apply(this, result);
			}
			return result;
		};
	}
}

module.exports = Reflection;