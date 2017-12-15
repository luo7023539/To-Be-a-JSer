## Webpack 性能分析

### Webpack 打包后体积分析

通过Webpack自带命令生成json数据后借助图表分析

```
webpack --profile --json > stats.json
```

可以上传至以下两个做数据分析

[webpack-chart](http://alexkuz.github.io/webpack-chart/)

[webpack-analyse](http://webpack.github.io/analyse/)

另外以下`plugin`加至webpack配置项，自动生成分析文件
1. `webpack-visualizer-plugin`
2. `webpack-bundle-analyzer`

### Webpack 打包速度分析

可通过以下查看webpack命令行参数
```
webpack --help
```

通过增加colors、profile、display-modules显示过程信息

* --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
* --profile输出性能数据，可以看到每一步的耗时
* --display-modules默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块 这次命令行的结果已经很有参考价值，可以帮助我们定位耗时比较长的步骤


增加以上参数后，可得到以下日志信息，具体到每一个模块的打包时间
```
Hash: cdea65709b783ee0741a
Version: webpack 1.10.0
Time: 320ms
     Asset    Size  Chunks             Chunk Names
bundle.js  148 kB       0  [emitted]  main
   [0] ./entry.js 125 bytes {0} [built]
       factory:11ms building:9ms = 20ms
   [1] ../~/moment/min/moment-with-locales.min.js 146 kB {0} [built] [1 warning]
       [0] 20ms -> factory:8ms building:263ms = 291ms
   [2] (webpack)/buildin/module.js 251 bytes {0} [built]
       [0] 20ms -> [1] 271ms -> factory:3ms building:1ms = 295ms

```

通过以上两种方式对webapck打包的体积及性能做相应的分析。

后续附上相应部分的优化技巧