/** 用于开发环境的服务启动 **/
const path = require('path') // 获取绝对路径有用
const express = require('express') // express服务器端框架
const bodyParser = require('body-parser')
const webpack = require('webpack') // webpack核心
const webpackDevMiddleware = require('webpack-dev-middleware') // webpack服务器
const webpackHotMiddleware = require('webpack-hot-middleware') // HMR热更新中间件
const webpackConfig = require('./webpack.config.dev.js') // webpack开发环境的配置文件

const app = express() // 实例化express服务
const DIST_DIR = webpackConfig.output.path // webpack配置中设置的文件输出路径，所有文件存放在内存中
const PORT = 3000 // 服务启动端口号

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const compiler = webpack(webpackConfig) // 实例化webpack
app.use(express.static('dll'))
app.use(
  webpackDevMiddleware(compiler, {
    // 挂载webpack小型服务器
    publicPath: webpackConfig.output.publicPath, // 对应webpack配置中的publicPath
  })
)
// 挂载HMR热更新中间件
app.use(webpackHotMiddleware(compiler))
// 所有请求都返回index.html
app.get('*', (req, res, next) => {
  const filename = path.join(DIST_DIR, 'index.html')

  // 由于index.html是由html-webpack-plugin生成到内存中的，所以使用下面的方式获取
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

/** 启动服务 **/
app.listen(PORT, () => {
  console.log('server started on: http://localhost:%s', PORT)
})