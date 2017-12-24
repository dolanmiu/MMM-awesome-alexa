const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

module.exports = {
    entry: "./src/renderer/index.ts",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "bundle.js",
        publicPath: "./",
        libraryTarget: "var",
        library: "AlexaVoiceService",
    },

    resolve: {
        extensions: [".ts"],
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ["awesome-typescript-loader"],
            },
        ],
    },
};