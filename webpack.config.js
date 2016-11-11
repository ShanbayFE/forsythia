const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const buildPath = path.join(__dirname, 'build/');

const plugins = [
    new CleanWebpackPlugin(['./build']),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    }),
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

const commonConfig = {
    entry: {
        'admin-ui': './src/stylesheets/admin_ui/main.less',
        'react-components': './src/javascripts/react-components/index',
    },
    output: {
        path: buildPath,
        filename: '[name].js',
        library: 'xbay',
        libraryTarget: 'var',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    module: {
        loaders: commonLoaders,
    },
    plugins,
};

const clientConfig = {
    entry: {
        client: './src/javascripts/client/main',
        'client-head': './src/javascripts/client/head',
        'client-tail': './src/javascripts/client/tail',
    },
    output: {
        path: buildPath,
        filename: '[name].js',
        library: 'xbay',
        libraryTarget: 'var',
    },
    module: {
        loaders: commonLoaders,
    },
    plugins,
};

// pc 和 mobile 暂时没有区分 analysis，所以统一使用 client 的 analysis
const mobileConfig = {
    entry: {
        mobile: './src/javascripts/mobile/main',
        'mobile-head': './src/javascripts/client/head',
        'mobile-tail': './src/javascripts/client/tail',
    },
    output: {
        path: buildPath,
        filename: '[name].js',
        library: 'xbay',
        libraryTarget: 'var',
    },
    module: {
        loaders: commonLoaders,
    },
    plugins,
};

const demoConfig = {
    entry: {
        'react-components-modal': './docs/react-components/modal/index.js',
        'react-components-pager': './docs/react-components/pager/index.js',
        'react-components-word-select-content':
            './docs/react-components/word-select-content/index.js',
        'react-components-highlight-content':
            './docs/react-components/highlight-content/index.js',
        client: './docs/javascript/client/index.js',
        mobile: './docs/javascript/mobile/index.js',
    },
    output: {
        path: path.join(__dirname, 'demo-build/'),
        filename: '[name].js',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        xbay: 'xbay',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel'],
            },
        ],
    },
};

module.exports = [
    commonConfig, clientConfig, mobileConfig, demoConfig,
];
