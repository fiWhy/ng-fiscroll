var webpack = require("webpack");
var path = require("path");
var isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var src = path.join(__dirname, "src");
var pluginName = "ng-fiscroll";

module.exports = {
    entry: {
        [pluginName]: path.join(src, pluginName + ".js"),
    },
    output: {
        filename: "[name].min.js",
        path: path.join(__dirname, "dist"),
        publicPath: "",
    },
    resolve: {
        extensions: [".js", ".scss"],
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader' },
                        {
                            loader: 'postcss-loader',
                            options: {
                                autoprefixer: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [
                                    src
                                ]
                            }
                        }
                    ]
                })
            }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: pluginName + ".css",
        })
    ].concat(isDevServer?[
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./example/index.html")
        })
    ]:[
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ])
}