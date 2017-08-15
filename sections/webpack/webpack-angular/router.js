module.exports = [
  {
    "appid": "root",
    "state": "global",
    "url": "/",
    "controller": "/pages/root/controller/rootCtrl.js",
    "templateURL": "/pages/root/views/root.html",
    "deps": []
  },
  {
    "appid": "home",
    "state": "global.home",
    "url": "/home",
    "controller": "/pages/home/controller/rootCtrl.js",
    "templateURL": "/pages/home/views/root.html",
    "deps": []
  },
  // {
  //   "appid": "bar",
  //   "state": "global.bar",
  //   "controller": "/pages/bar/controller/root.js",
  //   "templateURL": "/pages/bar/view/root.html",
  //   "deps": []
  // },
  // {
  //   "appid": "foo",
  //   "state": "global.foo",
  //   "controller": "/pages/foo/controller/root.js",
  //   "templateURL": "/pages/foo/view/root.html",
  //   "deps": []
  // }
]