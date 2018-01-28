const path = require('path');
const webpack = require('webpack');

module.exports = {

    cache: true,
    devtool: "cheap-source-map",

    entry: {
        'layout-basic': [
            path.resolve('src', 'js', 'layout-basic'),
        ],
        'example-lqdn-gafam-chooser': [
            path.resolve('htdocs', 'examples', 'lqdn-gafam-campaign/chooser.js'),
        ],
        'example-lqdn-gafam-poster': [
            path.resolve('htdocs', 'examples', 'lqdn-gafam-campaign/poster.js'),
        ],
    },

    amd: {
        'jquery': true,
    },

    output: {
        path: path.resolve(__dirname, 'htdocs', 'examples', '_static', 'assets'),
        filename: '[name].bundle.js',
        publicPath: '../_static/assets/',
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

    ],

};
