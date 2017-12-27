const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const path = require("path");

const clientConfig = {
    entry: "./src/renderer/MMM-awesome-alexa.ts",
    output: {
        path: __dirname,
        filename: "MMM-awesome-alexa.js",
    },

    resolve: {
        extensions: [".ts"],
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ["awesome-typescript-loader"],
            }
        ],
    },
};
const serverConfig = {
    target: "node",
    externals: [nodeExternals()],
    entry: "./src/main/index.ts",
    output: {
        path: __dirname,
        filename: "node_helper.js",
        libraryTarget: "commonjs2",
        library: "yourLibName",
    },
    node: {
        __dirname: false
    },

    resolve: {
        extensions: [".ts"],
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ["awesome-typescript-loader"],
            }
        ],
    },
};

module.exports = [serverConfig, clientConfig];