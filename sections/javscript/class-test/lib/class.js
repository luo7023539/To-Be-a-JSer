"use strict";

require("core-js/modules/es6.regexp.to-string");

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

let str = 'nihao';

let Parent = /*#__PURE__*/function () {
  // 实例属性
  // prop = 'a'
  function Parent() {
    _classCallCheck(this, Parent);

    this.prop = 'b';
  }

  _createClass(Parent, [{
    key: "_self",
    // 靠命名区分的私有方法
    value: function _self() {} // 原型方法

  }, {
    key: "outer",
    value: function outer() {}
  }, {
    key: "prop",
    get: function get() {
      return str;
    },
    set: function set(value) {
      str = value;
    } // 静态方法

  }], [{
    key: "func",
    value: function func() {}
  }]);

  return Parent;
}();

let Child = /*#__PURE__*/function (_Parent) {
  _inherits(Child, _Parent);

  var _super = _createSuper(Child);

  function Child() {
    var _this;

    _classCallCheck(this, Child);

    _this = _super.call(this);
    console.log('Child');
    return _this;
  }

  return Child;
}(Parent);

let child = new Child();
child.prop = 'child';
console.log(child.hasOwnProperty('prop'));