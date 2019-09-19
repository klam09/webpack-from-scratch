const path = require('path');

const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => {
    const isProd = env.NODE_ENV === 'production';

    return {
        context: path.resolve(__dirname, './src'),
        devServer: {
            contentBase: './dist',
            disableHostCheck: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            host: '0.0.0.0',
            hot: true,
            hotOnly: true,
            open: true,
            port: 8080,
        },
        entry: [
            path.resolve(__dirname, './src/index.js'),
            path.resolve(__dirname, './src/index.scss'),
        ],
        mode: isProd ? 'production' : 'development',
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            }, {
                test: /\.s?css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                require('postcss-preset-env')({
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                        cascade: false,
                                    },
                                    stage: 3,
                                }),
                            ],
                        },
                    },
                    'sass-loader'
                ],
            }, {
                test: /\.(gif|jpe?g|png|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images/',
                        publicPath: '/images/',
                        name: '[name].[ext]',
                    },
                },
            }, {
                test: /\.html$/,
                use: 'html-loader',
            }],
        },
        optimization: {
            minimize: isProd,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                            drop_console: isProd, // or pure_funcs: ['console.log', 'console.info']
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: !isProd,
                }),
                new OptimizeCssAssetsPlugin({
                    cssProcessorOptions: {
                        reduceTransforms: false,
                        reduceIdents: false,
                    },
                }),
            ],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: `js/[name].js`,
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename:'css/[name].css',
            }),
            new HtmlPlugin({
                template: path.resolve(__dirname, './src/index.html'),
                filename: 'index.html',
                xhtml: true,
            }),
            new webpack.DefinePlugin({
                IS_PROD: isProd
            }),
        ],
        resolve: {
            extensions: ['.js', '.json', '.scss'],
            alias: {
                '@assets': path.resolve(__dirname, './src/assets'),
                '@images': path.resolve(__dirname, './src/assets/images'),
                '@fonts': path.resolve(__dirname, './src/assets/fonts'),
                '@styles': path.resolve(__dirname, './src/scss'),
                '@js': path.resolve(__dirname, './src/js'),
                '@src': path.resolve(__dirname, './src'),
            },
        },
    };
};
