## Webpack 入门教程

首先全局安装webpack、webpack-dev-server

__测试学习的时候请注意版本__

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

#### 要点
* 针对需要单独分包的文件使用`require.ensure`方法将依赖从bundle文件分离出去
* Webpack将帮你管理依赖的加载顺序
* 每个被分离出去的块都会被分配一个数字,即加载依赖的标志
* 公用的依赖不会被重复打包!!!

### DEMO12: 公共包 ([source](https://github.com/ruanyf/webpack-demos/tree/master/demo12))

当多个脚本存在公用的模块的时候,你可以使用CommonsChunkPlugin将公共部分提取成一个单独的文件
webpack.config.js

```javascript
// main1.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello World</h1>,
  document.getElementById('a')
);

// main2.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h2>Hello Webpack</h2>,
  document.getElementById('b')
);
```

```javascript
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
  entry: {
    bundle1: './main1.jsx',
    bundle2: './main2.jsx'
  },
  output: {
    filename: '[name].js'
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
    ]
  },
  plugins: [
    new CommonsChunkPlugin('init.js')
  ]
}
```

#### 要点
* 传入字符串参数, 默认会把所有入口节点的公共代码提取出来
* 有选择的提取公共代码, `CommonsChunkPlugin('common.js',['main','index'])`
* 有选择性的提取（对象方式传参）


## Demo13: 插件包 ([source](https://github.com/ruanyf/webpack-demos/tree/master/demo13))

也可以通过CommonsChunkPlugin将插件合并打包成一个单独的js文件

main.js

```javascript
var $ = require('jquery');
$('h1').text('Hello World');
```

index.html

```html
<html>
  <body>
    <h1></h1>
    <script src="vendor.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js',
    vendor: ['jquery'],
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js')
  ]
};
```

```javascript
// main.js
$('h1').text('Hello World');
// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js'
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};
```

#### 要点 
* CommonsChunkPlugin可以根据指定的参数抽出公用的逻辑、甚至用来打包插件
* 如果你想要某个模块在所有模块不必引入就可是使用,例如 $（jquery）,你需要使用
  `ProvidePlugin` ([Official doc](http://webpack.github.io/docs/shimming-modules.html)).
  
  
### DEMO14: 暴露全局变量 ([source](https://github.com/ruanyf/webpack-demos/tree/master/demo14))

如果你想要使用某些全局变量,而无需将它们引入,你可以在`webpack.config.js` 中通过`externals`配置。([官方文档](http://webpack.github.io/docs/library-and-externals.html)).

```javascript
var data = 'Hello World';
```

We can expose `data` as a global variable.

```javascript
// webpack.config.js
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
    ]
  },
  externals: {
    // require('data') is external and available
    //  on the global var data
    'data': 'data'
  }
};
```

现在,你可以像引入模块一样引入`data`。但它实际上是一个全局变量

```javascript
// main.jsx
var data = require('data');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>{data}</h1>,
  document.body
);
```

### DEMO15: React 组件热替换

### DEMO16: React-router

* 最后两部分跟React相关,需要的可以在阮大github中阅读

#### 待完善

* 具体应用至项目当中!!!
* [webpack-angular-example](https://github.com/Treri/webpack-angular-example)


#### Refer To 

* [webpack-demos](https://github.com/ruanyf/webpack-demos)