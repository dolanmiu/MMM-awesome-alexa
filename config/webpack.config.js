var webpack = require('webpack');

var nodeModules = {};

module.exports = {
    devtool: 'source-map',

    entry: {
        'bundle': './src/index.ts'
    },

    output: {
        path: './dist',
        publicPath: './',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        extensions: ['.ts']
    },

    module: {
        loaders: [{
            test: /\.ts$/,
            loaders: ['awesome-typescript-loader']
        }]
    },

    externals: nodeModules,
};