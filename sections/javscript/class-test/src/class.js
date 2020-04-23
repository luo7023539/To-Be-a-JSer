let str = 'nihao';
class Parent {
    // 实例属性
    // prop = 'a'

    constructor() {
        this.prop = 'b'
    }
    get prop() {
        console.log("Parent GET")
        return str;
    }
    set prop(value) {
        console.log("Parent SET")
        str = value;
    }

    // 静态方法
    static func() {

    }

    // 靠命名区分的私有方法
    _self() {

    }
    // 原型方法
    outer() {

    }
}

class Child extends Parent {
    constructor() {
        super();
        console.log('Child');
    }

    get prop() {
        console.log("Child GET")
        return str;
    }
    set prop(value) {
        console.log("Child SET")
        str = value;
    }
}

let child = new Child()

child.prop = 'child'
console.log(child.hasOwnProperty('prop'))