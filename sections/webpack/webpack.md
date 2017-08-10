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

## Demo08 HTML、浏览器插件

接下来展示如何使用第三方插件


* [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) 能自动创建一个index.html
* [open-browser-webpack-plugin](https://github.com/baldore/open-browser-webpack-plugin) 能自动打开浏览器

webpack.config.js

```javascript
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Webpack-demos',
      filename: 'index.html'
    }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ]
};
```

### Demo09: 环境标志

可以通过设置环境标志来保证某些代码仅在某些环境当中生效

main.js

```javascript
document.write('<h1>Hello World</h1>');

if (__DEV__) {
  document.write(new Date());
}
```

webpack.config.js

```javascript
var webpack = require('webpack');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [devFlagPlugin]
};
```

将环境变量传入webpack中

```bash
# Linux & Mac
$ env DEBUG=true webpack-dev-server

# Windows-cmd
$ set DEBUG=true
$ webpack-dev-server

# Windows-powershell
$ $env:DEBUG='true'
$ webpack-dev-server
```

### 接下来比较重要!!!!!!

### DEMO10 代码分包 ([source](https://github.com/ruanyf/webpack-demos/tree/master/demo10))

针对大型项目,不可能将所有代码仅仅打包成单一一个文件,Webpack允许你将它们分割成许多块。

尤其是当某一块的代码只在特定的模块当中使用的时候,可以通过该功能实现按需加载。

首先,你需要使用`require.ensure`来定义一个分割点([官方文档](http://webpack.github.io/docs/code-splitting.html))

```javascript
// main.js
require.ensure(['./a'], function(require) {
  var content = require('./a');
  document.open();
  document.write('<h1>' + content + '</h1>');
  document.close();
});
```


`require.ensure` 通知Webpack将`./a.js`从`bundle.js`分离分离出去,单独打包。

```javascript
// a.js
module.exports = 'Hello World';
```

接下来,项目的模块依赖、加载顺序由Webpack托管,你无需在其他地方声明

webpack.config.js

```javascript
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
```

打包后,你会发现,`main.js` 和 `a.js`被打包成`bundle.js` and `1.bundle.js`,并且自动按需加载。

#### 要点
* 针对需要单独分包的文件使用`require.ensure`方法将依赖从bundle文件分离出去
* Webpack将帮你管理依赖的加载顺序
* 每个被分离出去的块都会被分配一个数字,即加载依赖的标志
* 公用的依赖不会被重复打包!!!

### Demo11: 通过bundle-loader实现代码分包 ([source](https://github.com/ruanyf/webpack-demos/tree/master/demo11))

另一种实现分包的方式 [bundle-loader](https://www.npmjs.com/package/bundle-loader).

```javascript
// main.js

// Now a.js is requested, it will be bundled into another file
var load = require('bundle-loader!./a.js');

// To wait until a.js is available (and get the exports)
//  you need to async wait for it.
load(function(file) {
  document.open();
  document.write('<h1>' + file + '</h1>');
  document.close();
});
```















#### 待完善

* DEMO09存在问题,直接跑不动,__DEV__报错

#### Refer To 

* [webpack-demos](https://github.com/ruanyf/webpack-demos)