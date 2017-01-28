const path = require('path');
const prefix = (process.env.NODE_ENV === 'production') ? '.min.js' : '.js';

module.exports = {
    output: {
        path: './dist',
        filename: '[name]' + prefix
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    entry: {
        'ng-tree-view': './index'
    },
    externals: {
        'angular': 'angular'
    },
    devtool: 'source-map'
};
