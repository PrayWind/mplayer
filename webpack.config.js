const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
  filename: "[name].css"

module.exports = {
  entry: {
    app:'./src/index.js',
    admin: './src/admin.js',
  },
  //devtool: 'inline-source-map',
  //devServer: {
  //  contentBase: './dist'
  //},
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].css"
    }),
    //new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  module: {
     rules: [
       {
         test: /\.js$/,
         exclude: /(node_modules|bower_components)/,
         use: {
           loader: 'babel-loader',
           options: {
             presets: ['@babel/preset-env'],
	     //plugins: ['@babel/transform-runtime']
           }
         }
       },
       {
         test: /\.css$/,
         loader: ExtractTextPlugin.extract({
	   use: [
             //'style-loader',
             'css-loader',
	     'postcss-loader',
           ]
	 })
       },
       {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader'
         ]
       }
     ]
   }
};
