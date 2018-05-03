var os = require('os');
const config = require('./webpack.config');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

config.output.filename = '[name].bundle.min.js';

// Apply code splitting
// https://webpack.js.org/guides/code-splitting/
// https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
config.optimization.splitChunks = {
    cacheGroups: {
        commons: {
            //test: /[\\/]node_modules[\\/]/,
            name: "commons",
            filename: "commons.bundle.min.js",
            chunks: "initial",
            minChunks: 3,
            reuseExistingChunk: true,
        }
    }
};


config.optimization.minimizer = [

    // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
    new UglifyJsPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        /*
        uglifyOptions: {
            ie8: false,
            compress: {
                passes: 2,
                //toplevel: true,
                warnings: false,
                properties: true,
                sequences: true,
                dead_code: true,
                conditionals: true,
                comparisons: true,
                evaluate: true,
                booleans: true,
                unused: true,
                loops: true,
                hoist_funs: true,
                hoist_props: true,
                hoist_vars: true,
                //cascade: true,
                if_return: true,
                join_vars: true,
                drop_console: false,
                drop_debugger: true,
                //unsafe: true,
                negate_iife: true,
                //side_effects: true
            },
            mangle: {
                //toplevel: true,
                //sort: true,
                //eval: true,
                properties: true
            },
            output: {
                comments: false,
                beautify: false,
            },
        },
        */
    })

];


module.exports = config;
