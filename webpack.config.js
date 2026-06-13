const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    cache: true,
    devtool: "cheap-source-map",

    entry: {
        'layout-basic': [
            path.resolve('src', 'js', 'layout-basic'),
        ],
        'example-unsicherheit-chooser': [
            path.resolve('posters', 'unsicherheit-2.0', 'chooser.js'),
        ],
        'example-unsicherheit-poster': [
            path.resolve('posters', 'unsicherheit-2.0', 'poster.js'),
        ],
    },

    amd: {
        'jquery': true,
    },

    output: {
        path: path.resolve(__dirname, 'htdocs', 'examples', '_static'),
        filename: '[name].bundle.js',
        publicPath: '../_static/',
    },

    optimization: {
        usedExports: true,

        // https://webpack.js.org/plugins/module-concatenation-plugin/
        //concatenateModules: false,

        // To keep filename consistent between different modes (for example building only)
        occurrenceOrder: true
    },

    module: {
        rules: [
            // Do these to expose their symbols to the template namespace
            {
                test: require.resolve('jquery'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'jQuery',
                    },
                    {
                        loader: 'expose-loader',
                        options: '$',
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    'html-loader',
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|swf|ico)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },

    resolve: {
        // Options for resolving module requests (does not apply to resolving to loaders)

        // Directories where to look for modules
        modules: [
            "node_modules", "src/js",
        ],

        extensions: [".js", ".jsx", ".min.js", ".json", ".css"],

        alias: {
        }
    },

    plugins: [

        // https://webpack.js.org/plugins/provide-plugin/
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
        }),

        // https://www.npmjs.com/package/html-webpack-plugin
        // https://github.com/jantimon/html-webpack-plugin
        new HtmlWebpackPlugin({
            chunks: ['commons', 'example-unsicherheit-chooser'],
            filename: '../unsicherheit-2.0/chooser.html',
            template: path.resolve('posters', 'unsicherheit-2.0', 'chooser.html'),
            inject: 'head',
        }),
        new HtmlWebpackPlugin({
            chunks: ['commons', 'example-unsicherheit-poster'],
            filename: '../unsicherheit-2.0/poster.html',
            template: path.resolve('posters', 'unsicherheit-2.0', 'poster.html'),
            inject: 'head',
        }),

        // https://github.com/webpack-contrib/copy-webpack-plugin
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve('posters', 'unsicherheit-2.0', 'img'),
                    to: '../unsicherheit-2.0/img/',
                },
            ]
        }),

    ],

};
