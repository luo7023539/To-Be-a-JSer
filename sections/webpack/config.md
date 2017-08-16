## Webpack 配置项详解

文档注解

[Webpack](https://webpack.js.org)
#### context

`string`

基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader

默认使用当前目录，但是推荐在配置中传递一个值。这使得你的配置独立于 CWD(current working directory - 当前执行路径)。

#### entry

模块起点,可以传入字符串、数组、对象三种形式

如果传入数组,则数组中每一项都将被运行,且将他们打包成一个chunk

如果传入对象,每一个键值对都将被打包成块

```
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
```

该方式可以通过`CommonsChunkPlugin`,将公共模块提取至vendors

#### output

* filename 指定文件名
* path 指定文件路径
##### output.chunkFilename

`[id]` `[name]` `[hash]` `[chunkhash]` 

这四种均可用于无入口chunk的path中使用其值替换

##### output.library

如果该值被设定,`bundle`会导出成library,该值即其名称

当你书写了一个`library`,且需要导出成单一文件的时候使用它

需要配合libraryTarget

##### output.sourceMapFileName

`Default: "[file].map"`

#### resolve 
##### resolve.alias 

