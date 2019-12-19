const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {url: false}
                    }
                ],
                include: path.resolve(__dirname, '../'),
            },
            {
                test: /\.(sass|scss)$/,
                loaders: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {url: false}
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass")
                        },
                    }],
                include: path.resolve(__dirname, '../'),
            },
        ],
    },
};