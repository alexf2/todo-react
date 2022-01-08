const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // ?
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

/* Custom Config */
// загрузка индивидуальных настроек разработчика из файла custom-dev.config, который должен бытьне под Git
let customDevConfig = {};
try {
    // eslint-disable-next-line global-require
    customDevConfig = require('./custom-dev.config');
} catch (e) {
    console.warn('Define custom-dev.config.js in repository root');
}

// импорт из custom-dev.config.js
const {port = 3000, devtool, validateTS, showLinting} = customDevConfig;
/* Custom Config END */

/* Build type */
const isProduction = process.env.NODE_ENV === 'production';
const isTestMode = process.env.TEST_MODE === 'true';
/* Build type END */

/* Paths */
const PATHS = {
    indexFile: './src/index.tsx',
    appRoot: path.join(__dirname, 'src'),
    htmlTemplate: path.join(__dirname, 'src/assets/index.ejs'),
    srcAssets: path.join(__dirname, 'src/assets'),
    favIcon: 'src/assets/favicon.ico',
    build: path.join(__dirname, 'dist/assets'),
    tsconfig: path.join(__dirname, 'tsconfig.json'),
    globalStyles: path.join(__dirname, 'src/globalStyles'),
    antd: path.join(__dirname, 'node_modules/antd/dist'),
};
const watchIgnorePaths = [/css\.d\.ts$/, /less\.d\.ts$/, /node_modules/, /dist/];
const filesToCopy = [
    {from: 'src/assets/images', to: 'images/'},
];
/* Paths END */

/* Css, styles */
const getCssLoader = (loadersAfter = 1, options = {}) => ({
    loader: 'css-loader',
    options: {
        ...options,
        importLoaders: loadersAfter,
    },
});
const getStyleLoader = () => ({loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader'});

const rules = {
    tsx: {
        // test: /\.(jsx|js|tsx|ts)$/,
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: [PATHS.appRoot],
        use: [
            {
                loader: 'thread-loader',
                options: {
                    workerParallelJobs: 50,
                },
            },
            'babel-loader',
            {
                loader: 'ts-loader',
                options: {
                    happyPackMode: true, // используется вместе с thread-loader и ForkTsCheckerWebpackPlugin
                    transpileOnly: true, // используется вместе с happyPackMode, thread-loader и ForkTsCheckerWebpackPlugin
                    experimentalWatchApi: true,
                    getCustomTransformers: path.join(__dirname, './webpack.ts-transformers.js'),
                },
            },
        ],
    },
    jsx: {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: [PATHS.appRoot],
        use: [
            {
                loader: 'thread-loader',
                options: {
                    workerParallelJobs: 50,
                },
            },
            'babel-loader',
        ],
    },
    cssModules: {
        test: /\.less$/,
        include: [PATHS.appRoot],
        exclude: [PATHS.globalStyles],
        use: [
            getStyleLoader(),
            getCssLoader(2, {sourceMap: !isProduction, modules: {
                localIdentName: '[name]__[local]#[hash:base64:5]'},
            }),
            {loader: 'typed-css-modules-loader',
                options: {camelCase: true, noEmit: isProduction, context: PATHS.build},
            },
            'postcss-loader',// конфигурируется через postcss.config.js: там добавляются плагины и префиксинг для браузеров
            {loader: 'less-loader', options: {lessOptions: {javascriptEnabled: true}}},
        ],
    },
    less: {
        test: /\.less$/,
        include: [PATHS.globalStyles, PATHS.antd],
        use: [
            getStyleLoader(),
            getCssLoader(2),
            'postcss-loader',
            {loader: 'less-loader', options: {lessOptions: {javascriptEnabled: true}}},
        ],
    },
    // этот пайплайн нужен на случай импорта уже скомпилированного css из внешних подключаемых npm
    css: {
        test: /\.css$/,
        use: [
            getStyleLoader(),
            getCssLoader(1),
            'postcss-loader',
        ],
    },
    img: {
        test: /\.(jpg|jpeg|png|gif|ico)(\?.*)?$/,
        type: 'asset',
        parser: {
            dataUrlCondition: {
                maxSize: 10 * 1024,
            },
        },
        generator: {
            filename: '[name].[hash].[ext]',
        },
        exclude: /node_modules/,
    },
    svg: {
        test: /\.svg$/,
        type: 'asset',
        parser: {
            dataUrlCondition: {
                maxSize: 8 * 1024,
            },
        },
        use: 'svgo-loader',
        exclude: /node_modules/,
    },
    fonts: {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        type: 'asset/resource',
        exclude: /node_modules/,
    },
};
/* Css, styles END */

module.exports = {
    context: __dirname,
    target: 'web',
    entry: {spa: ['react-hot-loader/patch', PATHS.indexFile]}, // точка входа.
    mode: isProduction ? 'production' : 'development', // включает оптимизации

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.less'],
        modules: [PATHS.appRoot, 'node_modules'],
        alias: {
            common: PATHS.globalStyles,
        }, // если в коде нужны алиасы к пакам
        enforceExtension: false,
        plugins: [new TsconfigPathsPlugin()], // для поддержки алиасов папок в TS
    },

    output: {
        path: PATHS.build,
        filename: '[name].js',
        chunkFilename: '[name].chunk.js?[contenthash]',
        publicPath: '/assets/',
    },

    module: {
        rules: [
            rules.jsx,
            rules.tsx,
            rules.cssModules,
            rules.css,
            rules.less,
            rules.img,
            rules.svg,
            rules.fonts,
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({filename: '[name].[chunkhash].css'}),
        new webpack.WatchIgnorePlugin({paths: watchIgnorePaths}),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
            'process.env.TEST_MODE': isTestMode,
            __DEV__: JSON.stringify(!isProduction),
        }),
        new HtmlWebpackPlugin({
            favicon: PATHS.favIcon,
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: PATHS.htmlTemplate,
            inject: false,
            hash: true,
            chunks: ['vendor', 'spa', 'styles'],
            minify: {
                collapseWhitespace: true,
            },
            alwaysWriteToDisk: true, // в сочетании с HtmlWebpackHarddiskPlugin сохраняет index.html в dist
            chunksSortMode: 'none',
            // scriptLoading: 'blocking',
        }),
        new HtmlWebpackHarddiskPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ru/),
        new CopyWebpackPlugin({patterns: filesToCopy}),
        // линтинг уже включён в pre-commit hook, поэтому, это его дублирует
        showLinting && new ESLintPlugin(),

        isProduction && WebpackChunkHash(),
        (isProduction || validateTS) && new ForkTsCheckerWebpackPlugin({
            async: false,
            typescript: {memoryLimit: 8000, configFile: PATHS.tsconfig, watch: 'src/**/*.{ts,tsx}', useTypescriptIncrementalApi: true, checkSyntacticErrors: true},
        }),
    ].filter(Boolean),

    optimization: {
        moduleIds: isProduction ? 'deterministic' : 'named', // replaces HashedModuleIdsPlugin in v5; v5 advise to remove and use defaults
        minimizer: [new CssMinimizerPlugin(), '...'],
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    enforce: true,
                },
                styles: {
                    name: 'styles',
                    test: /\.(c|le)ss$/,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
            },
        },
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
            // publicPath: `http://localhost:${port}/`,
        },
        historyApiFallback: {
            rewrites: [
                {
                    from: /^\/((?!api|ws|assets|externals).)*$/,
                    to: '/',
                },
            ],
        },
        open: true,
        port,
        hot: 'only',
        compress: true,
    },

    devtool: isProduction ? false : devtool || 'source-map',

    stats: {
        assets: false,
        chunks: false,
        modules: false,
        children: false,
        source: false,
    },
};
