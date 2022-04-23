const path = require("path");

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
    module: {
        rules: [
            {
                test: /\.module.css$/i,
                exclude: [
                    /node_modules/
                ],
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]--[hash:base64:5]",
                            }
                        }
                    }
                ]
            },
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
