const { expect, assert } = require('chai');
const knight = require('../lib/index');

it('should be able to run google without errors', () => {
	knight('https://google.com');
});