var webpack = require('webpack');
var path = require("path");
module.exports = {
    entry: {
        uookie: './uookie.js',
    },
    output: {
        path: path.resolve(__dirname + "/../js"),
        filename: '[name].js'
    },
    module: {
        loaders: []
    }
}