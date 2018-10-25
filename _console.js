require('colors')

const color_method_map = {
	info: 'blue',
	warn: 'yellow',
	error: 'red'
}

Object.entries(color_method_map).forEach(([method, color]) => {
	const og_fn = console[method]
	console[method] = (arg, ...args) => {
		if (typeof arg === 'string') arg = arg[color]
		og_fn(arg, ...args)
	}
})

module.exports = console