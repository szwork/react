const path = require('path');
const webpack = require('webpack');

const node_modules = path.resolve(__dirname, 'node_modules');
const pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
const pathToReactDOM = path.resolve(node_modules, 'react-dom/dist/react-dom.min.js');

const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const port = 9090;
const config = {
    resolve: {//重定向路径
        alias: {
            //'react'           :   'react/dist/react.min.js',
            //'react-dom'       :   'react-dom/dist/react-dom.min.js',
            'react-router'  :   'react-router/umd/ReactRouter.min.js',
            'redux'         :   'redux/dist/redux.min.js',
            'react-redux'   :   'react-redux/dist/react-redux.min.js',

            'utils'         : path.resolve(__dirname, 'app/page/utils/utils'),
            'net'           : path.resolve(__dirname, 'app/page/utils/net'),
            'pure-render-decorator': path.resolve(__dirname, 'app/page/utils/pure-render-decorator'),
        }
    },
    entry: {
        main: './app/page/main',
        common: [
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'react-router',
            'react-router-redux',
            'net',
            'pure-render-decorator'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[hash:8].js',
        publicPath: './'
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/, 
                loader: 'babel',
                exclude:[
                    //在node_modules的文件不被babel理会
                    path.resolve(__dirname,'node_modules'),
                ],
                include:[
                    //指定app这个文件里面的采用babel
                    path.resolve(__dirname,'app'),
                ],
                /*query:{//.可以在.babelrc声明
                    plugins:["transform-decorators-legacy"],
                    presets:['es2015','stage-0','react']
                } */
            },  
            {//css
                test: /\.css$/, 
                loader: 'style!css' 
            },
            {// SASS
              test: /\.scss$/,
              loader: 'style!css!sass'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url?limit=25000'
            }
        ],
        noParse: [
            //'react/dist/react.min.js',
            //'react-dom/dist/react-dom.min.js',
            //'react-router/umd/ReactRouter.min.js',
            //'redux/dist/redux.min.js',
            //'react-redux/dist/react-redux.min.js'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: 'app/index.tpl.html',
          inject: 'body',
          filename: 'index.html'
        }),
        new webpack.DefinePlugin({//生产环境
          'process.env.NODE_ENV': JSON.stringify('production'),
          __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
        }),
        new webpack.optimize.DedupePlugin(),//查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        new webpack.optimize.UglifyJsPlugin({//webPack 提供了内建插件，直接配置以下代码即可压缩代码
            output: {
                comments: false,  // remove all comments
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new OpenBrowserPlugin({ url: 'http://localhost:'+port })
      ]
};
module.exports = config;