# dmojs
DMO is a shortname of Data Manipulation Object, a lightweight module for manipulate object and emit message.

## Installation
Install with [npm](http://npmjs.org)

```bash
npm install dmojs --save
```

## Usage
Use as node module:

```javascript
var DMO = require('dmo')
```

Instance:
```javascript
var d = new DMO({
	props: {
		title: 'dmo.js miao~'
	}
})
```

Get data:
```js
d.$data.title // --> 'dmo.js miao~'
d.$get('title') // --> 'dmo.js miao~'
```

Set data:
```js
d.$set('desc', 'demo.js demo')
console.log(d.$data.desc) // --> 'demo.js demo'
```
