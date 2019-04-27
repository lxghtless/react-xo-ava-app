const path = require('path');
const assign = require('object-assign');
const loaderUtils = require('loader-utils');
const objectHash = require('object-hash');
const createCache = require('loader-fs-cache');

const pkg = require('../package.json');

const cache = createCache('xo-loader');

const engines = {};

/**
 * Class representing an ESLintError.
 * @extends Error
 */
class ESLintError extends Error {
	/**
   * Create an ESLintError.
   * @param {string} messages - Formatted eslint errors.
   */
	constructor(messages) {
		super();
		this.name = 'ESLintError';
		this.message = messages;
		this.stack = '';
	}

	/**
   * Returns a stringified representation of our error. This method is called
   * when an error is consumed by console methods
   * ex: console.error(new ESLintError(formattedMessage))
   * @return {string} error - A stringified representation of the error.
   */
	inspect() {
		return this.message;
	}
}

/**
 * PrintLinterOutput
 *
 * @param {Object} res xo.lintText return value
 * @param {Object} config eslint configuration
 * @param {Object} webpack webpack instance
 * @return {void}
 */
function printLinterOutput(res, config, webpack) { // eslint-disable-line complexity
	// Skip ignored file warning
	if (
		!(
			res.warningCount === 1 &&
      res.results[0].messages[0] &&
      res.results[0].messages[0].message &&
      res.results[0].messages[0].message.indexOf('ignore') > 1
		)
	) {
		// Quiet filter done now
		// eslint allow rules to be specified in the input between comments
		// so we can found warnings defined in the input itself
		if (res.warningCount && config.quiet) {
			res.warningCount = 0;
			res.results[0].warningCount = 0;
			res.results[0].messages = res.results[0].messages.filter(message => {
				return message.severity !== 1;
			});
		}

		// If enabled, use eslint auto-fixing where possible
		if (
			config.fix &&
      (res.results[0].output !== res.src ||
        res.results[0].fixableErrorCount > 0 ||
        res.results[0].fixableWarningCount > 0)
		) {
			const xolint = require(config.xolintPath);
			xolint.outputFixes(res);
		}

		if (res.errorCount || res.warningCount) {
			// Add filename for each results so formatter can have relevant filename
			res.results.forEach(r => {
				r.filePath = webpack.resourcePath;
			});
			const messages = config.formatter(res.results);

			if (config.outputReport && config.outputReport.filePath) {
				let reportOutput;
				// If a different formatter is passed in as an option use that
				if (config.outputReport.formatter) {
					reportOutput = config.outputReport.formatter(res.results);
				} else {
					reportOutput = messages;
				}

				const filePath = loaderUtils.interpolateName(
					webpack,
					config.outputReport.filePath,
					{
						content: res.results
							.map(r => {
								return r.source;
							})
							.join('\n')
					}
				);
				webpack.emitFile(filePath, reportOutput);
			}

			// Default behavior: emit error only if we have errors
			let emitter = res.errorCount ? webpack.emitError : webpack.emitWarning;

			// Force emitError or emitWarning if user want this
			if (config.emitError) {
				emitter = webpack.emitError;
			} else if (config.emitWarning) {
				emitter = webpack.emitWarning;
			}

			if (emitter) {
				if (config.failOnError && res.errorCount) {
					throw new ESLintError(
						'Module failed because of a eslint error.\n' + messages
					);
				} else if (config.failOnWarning && res.warningCount) {
					throw new ESLintError(
						'Module failed because of a eslint warning.\n' + messages
					);
				}

				emitter(new ESLintError(messages));
			} else {
				throw new Error(
					'Your module system doesn\'t support emitWarning. ' +
            'Update available? \n' +
            messages
				);
			}
		}
	}
}

/**
 * Webpack loader
 *
 * @param  {String|Buffer} input JavaScript string
 * @param {Object} map input source map
 * @return {void}
 */
module.exports = function (input, map) {
	const webpack = this;

	const userOptions = assign(
		// User defaults
		(webpack.options && webpack.options.xolint) || webpack.query || {},
		// Loader query string
		loaderUtils.getOptions(webpack)
	);

	const userXolintPath = path.dirname(userOptions.xolintPath);

	const config = assign(
		// Loader defaults
		{
			cacheIdentifier: JSON.stringify({
				'xo-loader': pkg.version,
				xolint: require(`${(userXolintPath || 'xo')}/package`).version
			}),
			xolintPath: 'xo',
			cwd: this.context,
			filename: this.resourcePath
		},
		pkg.xo || {},
		userOptions
	);

	if (typeof config.formatter === 'string') {
		try {
			config.formatter = require(config.formatter);
			if (
				config.formatter &&
        typeof config.formatter !== 'function' &&
        typeof config.formatter.default === 'function'
			) {
				config.formatter = config.formatter.default;
			}
		} catch (_) {
			// ignored
		}
	}

	if (config.formatter === null || typeof config.formatter !== 'function') {
		if (userXolintPath) {
			config.formatter = require(userXolintPath).getFormatter();
		} else {
			config.formatter = require('xo').getFormatter();
		}
	}

	const cacheDirectory = config.cache;
	const {cacheIdentifier} = config;

	delete config.cacheIdentifier;

	// Create the engine only once per config
	const configHash = objectHash(config);
	if (!engines[configHash]) {
		const xolint = require(config.xolintPath);
		const xoLintText = xolint.lintText;
		xolint.lintTextWithConfig = function (input) {
			return xoLintText(input, config);
		};

		engines[configHash] = xolint;
	}

	webpack.cacheable();

	let {resourcePath} = webpack;
	const cwd = process.cwd();

	// Remove cwd from resource path in case webpack has been started from project
	// root, to allow having relative paths in .eslintignore
	if (resourcePath.indexOf(cwd) === 0) {
		resourcePath = resourcePath.substr(cwd.length + 1);
	}

	const engine = engines[configHash];
	// Return early if cached
	if (config.cache) {
		const callback = webpack.async();
		return cache(
			{
				directory: cacheDirectory,
				identifier: cacheIdentifier,
				options: config,
				source: input,
				transform() {
					return lint(engine, input, resourcePath);
				}
			},
			(err, res) => {
				if (err) {
					return callback(err);
				}

				try {
					printLinterOutput(
						assign({}, res || {}, {src: input}),
						config,
						webpack
					);
				} catch (error) {
					err = error;
				}

				return callback(err, input, map);
			}
		);
	}

	printLinterOutput(lint(engine, input, resourcePath), config, webpack);
	webpack.callback(null, input, map);
};

function lint(engine, input) {
	return engine.lintTextWithConfig(input);
}
