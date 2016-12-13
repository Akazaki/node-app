module.exports = {
    entry: './jsx/index.jsx',
    output: {
      filename: './public/index.js'
    },
    devtool: 'inline-source-map',
    module: {
      loaders: [
    { test: /\.jsx$/, loader: 'jsx-loader' }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
};