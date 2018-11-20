const vm = require('vm');

class VM {
	constructor(code, scope) {
		console.log('runScript(size=%s)', code.length);
		// TODO pretty code?
		//code = beautify(code, { indent_size: 2, space_in_empty_paren: true });

		try {
			return vm.runInNewContext(code, scope, {
				displayErrors: false,
				timeout: 1 * 60 * 1000,
			});
		} catch (ex) {
			// TODO: better logs?
			//const first_line = ex.stack
			//.split('Error:')[1]
			//.split('\n')[1]
			// const [,line, colum] = /(\d+):(\d+)/.exec(first_line);
			// const slice_offset = 10;
			//const pretty_lines = pretty.split('\n').forEach((line, index) => console.log(index,line));//.slice(line - slice_offset, line + slice_offset);
			//console.log('pretty_lines', pretty_lines.join('\n'));
			console.error('vm.runInNewContext', ex);
		}
	}
}

module.exports = VM;