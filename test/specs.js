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
	describe('#set', function () {
		it('set data', function () {
			var d = new DMO({
				props: {
					title: 'dmo',
					posts: [{
						head: 'data'
					}]
				}
			})
			d.$set('desc', 'dmo.js')
			d.$set('title', 'dmo-test')
			d.$set('posts[0].head', 'data2')

			assert.equal(d.$data.desc, 'dmo.js')
			assert.equal(d.$data.title, 'dmo-test')
			assert.equal(d.$data.posts[0].head, 'data2')
		})
	})
}