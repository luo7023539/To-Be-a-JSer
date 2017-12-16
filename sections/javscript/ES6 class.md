## Class 继承的过程

问题来源在以下代码

```javascript
let str = 'nihao';
class Parent {
    constructor() {
      this.prop = 'Parent'
    }
    get prop() {
        return str ;
    }
    set prop(value) {
        str = value;
    }
}

class Child extends Parent{
    constructor(){
        super();
        console.log('Child');
    }
}

let child = new Child()

child.prop = 'child'
console.log(child.hasOwnProperty('prop'))
```