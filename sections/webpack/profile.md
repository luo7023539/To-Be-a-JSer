## 打包速度优化

### 搜索路径优化

#### 通过alias别名设置具体打包文件路径，用来优化路径搜索，且可防止重复打包的问题

```
    alias: {
      "@": path.resolve(__dirname, './src'),
      // "pixi.js$": "pixi.js/dist/pixi.min.js"
    },
```

设置@，表示项目的根路径

设置pixi.js别名，防止webpack通过其项目的index.js文件再次重新打包该模块

#### 如果项目仅存在同一个node_modules，可以设置其路径
```
    modules: [
      resolve('node_modules')
    ]f
```

### noparse
当已知某些模块无依赖，即在该模块中无`import`,`require`等用于引入模块的关键字方法时，可以设置noparse防止webpack重新扫描该模块

```
  noParse: ['pixi.js']
```

### 编译优化

一般webpack均会配置loader进行文件的预处理，可以通过inculde、exclude来指定需要排除预处理的文件及具体到需要编译的文件

```
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      presets: ["env", "stage-3", "es2015"]
    },
    // exclude: /node_modules/
    include: [
      // 只去解析运行目录下的 src 和 demo 文件夹
      path.join(process.cwd(), './src'),
    ]
  }
```