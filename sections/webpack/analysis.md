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



