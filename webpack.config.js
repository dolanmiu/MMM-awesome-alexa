const nodeExternals = require("webpack-node-externals");
const path = require("path");

const clientConfig = {
    mode: "production",
    entry: "./src/renderer/MMM-awesome-alexa.ts",
    output: {
        path: __dirname,
        filename: "MMM-awesome-alexa.js",
    },

    resolve: {
        extensions: [".ts"],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [path.resolve(__dirname, "src/renderer")],
                loaders: ["awesome-typescript-loader"],
            },
        ],
    },
};
const serverConfig = {
    target: "node",
    mode: "production",
    externals: [nodeExternals(), "node_helper"],
    entry: "./src/main/index.ts",
    output: {
        path: __dirname,
        filename: "node_helper.js",
        libraryTarget: "commonjs2",
        library: "yourLibName",
    },
    node: {
        __dirname: false,
    },

    resolve: {
        extensions: [".ts"],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [path.resolve(__dirname, "src/main")],
                loaders: ["awesome-typescript-loader"],
            },
        ],
    },
};

module.exports = [serverConfig, clientConfig];
