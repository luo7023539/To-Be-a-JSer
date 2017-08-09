## Webpack 入门教程

首先全局安装webpack、webpack-dev-server

```bash
$ npm i -g webpack@1.x webpack-dev-server@1.x
```

然后克隆仓库 - 并安装依赖

```bash
# Linux & Mac
$ git clone git@github.com:ruanyf/webpack-demos.git

# Windows
$ git clone https://github.com/ruanyf/webpack-demos.git
:
$ cd webpack-demos
$ npm install
```

可针对具体demo进行打包操作!!!


```bash
$ cd demo01
$ webpack  // 进行打包操作
$ webpack-dev-server  // 开启本地调试服务器
# 以上操作2选1即可
```

### DEMO01

```javascript
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
```

* 通过entry指定入口文件
* 通过output指定打包文件

### DEMO02

```javascript
module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
  },
  output: {
    filename: '[name].js'
  }
};
```

* 可以指定多个入口文件,相应的,也会生成多个打包后的文件

### DEMO03

React JSX 文件
```javascript
const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.querySelector('#wrapper')
);
```

首页

```html
<html>
  <body>
    <div id="wrapper"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
    ]
  }
};
```

* 可以通过module指定文件的加载器
* test传入正则,用于匹配文件名,应用该加载器
* exclude可指定忽略的目录
* loader用于指定具体的加载器
























#### Refer To 

* [webpack-demos](https://github.com/ruanyf/webpack-demos)