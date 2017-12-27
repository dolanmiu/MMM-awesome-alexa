const path = require("path");

module.exports = {
    entry: "./src/MMM-awesome-alexa.ts",
    output: {
        path: path.resolve(__dirname, "."),
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