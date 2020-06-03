## webpack - 文件路径相关问题

通杀文件路径，避免模糊

### Boundle

* Output

```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 制定文件输出的位置
    filename: 'my-first-webpack.bundle.js',
    publicPath: ""
    // 资源真实位置
    // 在指定publicPath的情况下
    // 大部分plugin会读取该路径插入到代码当中
  }
};
```

* htmlWebpackPlugin

提到`output`就必须扯到`htmlWebpackPlugin`

因为`index.html`中`<script>`的注入不大可能采用手动

html涉及路径的配置

```javascript
module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      // 输出位置及文件名
      filename: 'assets/admin.html',
      // 模板位置
      template: ""
    })
  ]
}
```

到这应应该可以形成一个最基本的脉络
`index.html`/`app.js`/`<script>`这三处大致应该明白

* devServer

项目想要顺利跑起来，就必须有一个服务器

部署以后，

各个资源位置就必须把上面的融会贯通

webpack提供的开发服务器配置都在`devServer`里面
