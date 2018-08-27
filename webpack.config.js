const path = require('path');
var basePath = __dirname;
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.join(basePath, 'src'),
    mode: "development",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    entry: {
        app: './index.tsx',
        vendor: [
            'react',
            'react-dom'
        ]
    },
    output: {
        path: path.join(basePath, 'dist'),
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: false,
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    devServer: {
        port: 8080,
        noInfo: false
    },
    plugins: [
        //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html', //Name of file in ./dist/
            template: 'index.html', //Name of template in ./src
            hash: true,
        }),
        // new MiniCssExtractPlugin({
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // }),
    ],
};