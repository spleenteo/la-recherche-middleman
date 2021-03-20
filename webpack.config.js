const path = require('path');
const webpack = require('webpack');
const autoprefixer = require("autoprefixer");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");

const extractMiniCss = new MiniCssExtractPlugin({
  filename: "stylesheets/[name].css"
});
module.exports = {
  entry: {
    application: __dirname + '/source/javascripts/index.js',
    styles: __dirname + '/source/stylesheets/_application.sass'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'source/stylesheets'),
      path.join(__dirname, 'source/javascripts'),
      "node_modules"
    ],
    alias: {
      modernizr$: path.resolve(__dirname, ".modernizrrc.js"),
      'slick': 'slick-carousel/slick/slick',
      'smooth-scroll': 'smooth-scroll/dist/js/smooth-scroll.polyfills'
    }
  },
  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].js',
  },
  module: {
    rules: [
      {
        loader: "webpack-modernizr-loader",
        test: /\.modernizrrc\.js$/
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.s[ac]ss/,
        use: 'import-glob-loader'
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    extractMiniCss,
    new MinifyPlugin(),
    new CompressionPlugin({
      cache: true
    })
  ]
};
