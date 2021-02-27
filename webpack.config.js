const webpack = require('webpack');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageConfigWebpackPlugin = require('image-config-webpack-plugin');
const path = require('path');

module.exports = (env, args) => {
    const isProductionMode = (args.mode === 'production');

    return {
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProductionMode ? '[name].[contenthash].js' : '[name].[hash].js',
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.svg$/,
                    use: ["@svgr/webpack"]
                },
                {
                    test: /\.(eot|otf|ttf|woff|woff2)$/,
                    loader: require.resolve("file-loader"),
                    options: {
                        name: "static/media/[name].[hash:8].[ext]"
                    }
                }
            ]
         },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'public/index.html',
                favicon: 'public/favicon.ico'
              }),
            new WasmPackPlugin({
                crateDirectory: path.resolve(__dirname, '.')
            }),
            new webpack.ProvidePlugin({
                TextDecoder: ['text-encoding', 'TextDecoder'],
                TextEncoder: ['text-encoding', 'TextEncoder']
            }),
            new ImageConfigWebpackPlugin(),
            new webpack.ProvidePlugin({
                "React": "react",
             })
        ],
        devServer: {
            historyApiFallback: {
                index: '/'
            }
          }
    };
}