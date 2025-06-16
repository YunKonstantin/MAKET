const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  mode: isProd ? 'production' : 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './js/main.js',
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'app'),
    clean: true,
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'app'),
    },
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 3001,
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: isProd ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      } : false,
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/img'),
          to: path.resolve(__dirname, 'app/img'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'src/imgSwiper'),
          to: path.resolve(__dirname, 'app/imgSwiper'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'src/font'),
          to: path.resolve(__dirname, 'app/font'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};