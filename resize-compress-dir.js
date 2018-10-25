/**
 * Use GraphicsMagick to perform batch resize & compress operations
 */

;(async () => {
	const promisify = require('util.promisify-all')
	const gm = require('gm')
	const parse_args = require('minimist')
	const console = require('./_console')
	const mkdirp = require('mkdirp')
	const fs = promisify(require('fs'))
	const path = require('path')

	// Parse CLI args
	const args = parse_args(process.argv, {
		alias: {
			in: 'i',
			out: 'o',
			width: 'w',
			height: 'h',
			format: 'f'
		},
		default: {
			width: null,
			height: null
		}
	})

	//
	const input_dir = args.in
	const output_dir = args.out
	const { width, height } = args

	if (!input_dir) {
		console.error('No input dir specified (use `--in` or `-i`)')
		process.exit(1)
	}
	if (!output_dir) {
		console.error('No output dir specified (use `--out` or `-o`)')
		process.exit(1)
	}
	if (!(width || height)) {
		console.error('No width or height specified (use `--width` or `-w`, or `--height` or `-h`)')
		process.exit(1)
	}

	// Ensure output dir exists
	await mkdirp(output_dir)

	// Get file names
	const filenames = await fs.readdir(input_dir)

	//
	const process_file = filename => {
		return new Promise(async (resolve, reject) => {
			const input_file = path.join(input_dir, filename)

			// prettier-ignore
			const output_file = args.format
				? path.join(output_dir, filename).replace(/\.\w+$/, `.${args.format}`)
				: path.join(output_dir, filename)

			await gm(input_file)
				.gravity('center')
				.resize(width, height, '^')
				.crop(width, height)
				.write(output_file, err => {
					if (err) reject(err)
					console.log(`${output_file} written.`)
					resolve()
				})
		})
	}

	// Read files
	await Promise.all(filenames.map(process_file))
	console.info(`${filenames.length} files processed.`)
})()
