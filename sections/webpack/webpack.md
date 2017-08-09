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

### DEMO01 单一入口

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

### DEMO02 多入口文件

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

### DEMO03 JSX文件编译、打包

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

针对babel-loader也可以使用以下方式指定具体的编译设置

```javascript
module: {
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }
  ]
}
```

* 可以通过module指定文件的加载器
* test传入正则,用于匹配文件名,应用该加载器
* exclude可指定忽略的目录
* loader用于指定具体的加载器,通过!连接多个加载器
* css、图片文件的加载均类似


### DEMO04 CSS打包

```javascript
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  }
};
```

* css采用style-loader及css-loader
* 当使用sass或less需要额外的加载器

### DEMO05 图片打包

```javascript
var img1 = document.createElement("img");
img1.src = require("./small.png");
document.body.appendChild(img1);

var img2 = document.createElement("img");
img2.src = require("./big.png");
document.body.appendChild(img2);
```

webpack.config.js

```javascript
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  }
};
```

* 图片使用url-loader,并且通过limit指定文件大小
* 当文件小于指定大小,该文件被转换为Data URL
* 当文件大于指定大小,会被转换为普通的路径
* 在js中require图片,实际得到的是一个url

### DEMO06 CSS 模块化

app.css

```css
.h1 {
  color:red;
}

:global(.h2) {
  color: blue;
}
```

main.jsx

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var style = require('./app.css');

ReactDOM.render(
  <div>
    <h1 className={style.h1}>Hello World</h1>
    <h2 className="h2">Hello Webpack</h2>
  </div>,
  document.getElementById('example')
);
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
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules'
      }
    ]
  }
};
```

访问打包后的文件,你会发现只有第二个h1标签是红色的,因为他的css仅在当前作用域生效,而h2是蓝色的,因为它的css在全局生效

* 可通过该加载器将该CSS文件作用模块引入
* 引入的CSS模块位一个对象
* 通过该方式加载的CSS默认在当前作用域内生效
* 也可以通过`:global(...)`将某一些css转换为全局生效
* 起到隔离CSS样式的作用,更加完整的实现Web组件化
* [更多相关的说明](https://css-modules.github.io/webpack-demo/)


### DEMO07 JS文件压缩

```javascript
var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
```

* 通过plugins指定所使用的插件
* uglifyJsPlugin可用于js文件压缩
* [UglifyJs Plugin](http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)




















#### Refer To 

* [webpack-demos](https://github.com/ruanyf/webpack-demos)