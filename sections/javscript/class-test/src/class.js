let str = 'nihao';
class Parent {
    // 实例属性
    // prop = 'a'

    constructor() {
        this.prop = 'b'
    }
    get prop() {
        return str;
    }
    set prop(value) {
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
}

let child = new Child()

child.prop = 'child'
console.log(child.hasOwnProperty('prop'))