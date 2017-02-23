var webpack = require('webpack');
var path = require("path");
module.exports = {
    entry: {
        ui: './ui.js',
    },
    output: {
        path: path.resolve(__dirname + "/../js"),
        filename: '[name].js'
    },
    module: {
        loaders: []
    }
}
