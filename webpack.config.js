const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const buildPath = path.join(__dirname, 'build/');

const plugins = [
    new CleanWebpackPlugin(['./build']),
    new ExtractTextPlugin('[name].css'),
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false,
    //     },
    // }),
];

const commonLoaders = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel'],
    },
    {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css!less'),
    },
    {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader?name=[name].[ext]',
    },
];

const config = {
    entry: {
        'forsythia': './src/javascripts/index.js',
    },
    output: {
        path: buildPath,
        filename: '[name].js',
        library: 'library',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        loaders: commonLoaders,
    },
    plugins,
};

module.exports = [
    config
];
