const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    devtool: "eval-source-map",
    entry: "./ui/app.jsx",
    output: {
        filename: "app.bundle.mjs",
        path: path.resolve(__dirname, "./public"),
        hashFunction: "xxhash64"
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    plugins: [
        new ESLintPlugin({
            extensions: [".js", ".jsx"],
            useEslintrc: true
        })
    ],
    watchOptions: {
        ignored: [
            "**/node_modules",
            "./core/**",
            "main.js"
        ]
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                include: [
                    /ui/
                ],
                exclude: [
                    /node_modules/
                ],
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", {
                                "targets": "defaults"
                            }],
                            "@babel/preset-react"
                        ]
                    }
                }]
            }
        ],
    },
};
