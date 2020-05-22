## webpack - 文件路径相关问题

通杀文件路径，避免模糊

### output

指明最后bundle输出的位置及文件名

```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
