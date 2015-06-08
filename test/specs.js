'use strict';

module.exports = function (DMO, assert) {
	describe('#instance', function () {
		it('Instance with "props" option', function () {
			var d = new DMO({
				props: {
					title: 'dmo'
				}
			})
			assert.equal(d.$data.title, 'dmo')
		})
	})
	describe('#get', function () {
		it('get data', function () {
			var d = new DMO({
				props: {
					title: 'dmo',
					posts: [{
						head: 'data'
					}]
				}
			})
			assert.equal(d.$get('title'), 'dmo')
			assert.equal(d.$get('posts[0].head'), 'data')
		})
	})
}