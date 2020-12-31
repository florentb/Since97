const glob = require('glob')
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const generateHTMLPlugins = () => glob.sync('./src/**/*.html').map(
  dir => new HTMLWebpackPlugin({
    filename: path.basename(dir),
    template: dir,
    scriptLoading: 'defer'
  })
)

module.exports = {
  entry: ['./src/js/app.js', './src/style/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    assetModuleFilename: 'static/[hash][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(pdf|gif|png|jpe?g|svg)$/,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/static/', to: './static/' }
      ]
    }),
    ...generateHTMLPlugins()
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map'
}
