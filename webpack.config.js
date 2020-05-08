var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var extractSass = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = {
  entry: {
    application: __dirname + '/source/javascripts/index.js',
    styles: __dirname + '/source/stylesheets/_application.sass'
  },
  resolve: {
    root: __dirname + '/source/javascripts',
    alias: {
      'slick': 'slick-carousel/slick/slick',
      'smooth-scroll': 'smooth-scroll/dist/js/smooth-scroll.polyfills'
    }
  },
  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].js',
  },
  module: {
    loaders: [
      {
        test: /.*\.sass$/,
        loader: extractSass.extract(['css', 'postcss', 'sass', 'import-glob-loader'])
      }
    ]
  },
  plugins: [
    extractSass
  ],
  postcss: function postcss() {
    return [autoprefixer];
  },
};
