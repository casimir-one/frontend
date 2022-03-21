'use strict';
const Visualizer = require('webpack-visualizer-plugin');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const DEFAULTS = {
    isDevelopment: process.env.NODE_ENV !== 'production',
    baseDir: path.join(__dirname, '..'),
};

function makePlugins(options) {
    const isDevelopment = options.isDevelopment;

    let plugins = [
        new Visualizer({
            filename: './statistics.html'
        }),
    ];

    if (!isDevelopment) {
        plugins = plugins.concat([
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                output: {
                    comments: false,
                },
                minimize: true,
                compress: {
                    warnings: false,
                }
            }),
            new webpack.optimize.AggressiveMergingPlugin(),
        ]);
    }

    return plugins;
}

function makeConfig(options) {
    if (!options) options = {};
    _.defaults(options, DEFAULTS);

    const isDevelopment = options.isDevelopment;

    return {
        devtool: isDevelopment ? 'cheap-eval-source-map' : 'source-map',
        entry: {
            deip: path.join(options.baseDir, 'src/browser.js'),
            'deip-tests': path.join(options.baseDir, 'test/api.test.js'),
        },
        output: {
            path: path.join(options.baseDir, 'dist'),
            filename: '[name].min.js',
        },
        plugins: makePlugins(options),
        module: {
            loaders: [{
                    test: /\.js?$/,
                    loader: 'babel',
                },
                {
                    test: /\.json?$/,
                    loader: 'json',
                },
            ],
        },
    };
}

if (!module.parent) {
    console.log(makeConfig({
        isDevelopment: process.env.NODE_ENV !== 'production',
    }));
}

exports = module.exports = makeConfig;
exports.DEFAULTS = DEFAULTS;