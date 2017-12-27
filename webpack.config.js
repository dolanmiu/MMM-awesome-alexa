module.exports = {
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