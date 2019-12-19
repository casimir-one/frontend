const path = require('path');

const moduleCssLoader = [
    'vue-style-loader',
    {
        loader: 'css-loader',
        options: {
            url: false,
            modules: {
                localIdentName: '[local]_[hash:base64:4]',
            },
            sourceMap: true
        }
    }
];

const cssLoader = [
    'vue-style-loader',
    {
        loader: 'css-loader',
        options: {
            url: false
        }
    }
];

const sassLoader = [
    {
        loader: "sass-loader",
        options: {
            implementation: require("sass")
        },
    }
];

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                oneOf: [
                    {
                        resourceQuery: /module/,
                        loaders: [
                            ...moduleCssLoader
                        ]
                    },
                    {
                        loaders: [
                            ...cssLoader
                        ]
                    }
                ],
            },
            {
                test: /\.(sass|scss)$/,
                oneOf: [
                    {
                        resourceQuery: /module/,
                        loaders: [
                            ...moduleCssLoader,
                            ...sassLoader
                        ]
                    },
                    {
                        loaders: [
                            ...cssLoader,
                            ...sassLoader
                        ]
                    }
                ],
                include: path.resolve(__dirname, '../'),
            },
        ],
    },
};