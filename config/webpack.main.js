var webpack = require("webpack");
var fs = require("fs");
var path = require("path");

var nodeModules = {};
fs.readdirSync("node_modules")
    .filter(function (x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

module.exports = {
    // devtool: "source-map",

    entry: {
        "bundle": "./src/renderer/index.ts",
    },

    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "./",
        filename: "[name].js",
        chunkFilename: "[id].chunk.js",
        libraryTarget: "var",
        library: "AlexaVoiceService",
    },

    resolve: {
        extensions: [".js", ".ts"],
    },

    module: {
        loaders: [{
            test: /\.ts$/,
            loaders: ["awesome-typescript-loader"],
        }, {
            test: /aws-sdk/,
            loaders: ["transform-loader?brfs"],
        },
        {
            test: /\.json$/,
            loaders: ["json-loader"],
        }],
    },

    // target: "node",

    // externals: nodeModules,
};
