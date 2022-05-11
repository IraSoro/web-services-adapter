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
