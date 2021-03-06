
var webpack = require('webpack')
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
var marked = require('marked')
var markedExample = require('marked-example')
var postcssImport = require('postcss-import')
var postcssCustomProperties = require('postcss-custom-properties')
var postcssColorFunction = require('postcss-color-function')
var cssnano = require('cssnano')

var pkg = require('basscss/package.json')

var renderer = new marked.Renderer()

renderer.code = markedExample({
  classes: {
    container: 'mb2 border border-thick border-darken rounded',
    rendered: 'p2 border-bottom border-thick border-darken',
    code: 'h5 m0 p2 border-none rounded-bottom',
  }
})

module.exports = {
  entry: {
    docs: [
      './src/index'
    ],
    dev: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/dev'
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: __dirname,
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.md$/,
        loaders: [
          'html',
          'markdown'
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          'css',
          'postcss'
        ]
      },
      {
        test: /\.png$/,
        loader: 'file-loader?name=/images/[hash].[ext]'
      }
    ]
  },

  plugins: [
    new StaticSiteGeneratorPlugin('docs.bundle.js', [
      '/',
      '/404.html'
    ], pkg),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  markdownLoader: { renderer },

  postcss: function () {
    return [
      postcssImport(),
      postcssCustomProperties(),
      postcssColorFunction(),
      cssnano()
    ]
  },

  devServer: {
    historyApiFallback: {
      index: '/dev.bundle'
    },
    hot: true
  },

  node: {
    fs: 'empty'
  }
}

