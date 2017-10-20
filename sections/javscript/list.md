## 列表

当不需要在一个很长的序列中查找元素,

或者对其进行排序时,

列表显得尤为有用!

* 不包含任何元素的列表成为空列表
* 包含元素的个数成为length
* 列表当前位置pos
* 采用listSize保存列表元素的个数
* 可以在末尾append一个元素
* 可以在一个给定元素后或者起始位置insert一个元素
* 使用remove方法从列表中删除元素
* 使用clear清空所有元素
* 使用toString显示所有元素
* 使用getElement显示当前元素
* 使用next可以从当前元素移动到下一个元素
* 使用prev可以移动到当前元素的前一个元素
* 使用moveTo直接移动到指定位置
* currPos返回当前位置

```javascript
   class List {
    constroctor (){
        this.listSize = 0;
        this.pos = 0;
        this.dataStore = [];
        this.clear = clear;
        this.find = find;
        this.toString = toString;
        this.append = append;
        this.remove = remove;
        this.front = front;
        this.end = end;
        this.prev = prev;
        this.next = next;
        this.length = length;
        this.currPos = currPos;
        this.moveTo = moveTo;
        this.getElement = getElement;
        this.contains = contains;
    }
    
    append (element) {
        this.dataStore[this.listSize++] = element;
    }
    
    find (element) {
        return this.dataStore.indexOf(element)
    }
    
    remove (element) {
        let index = this.find(element);
        this.dataStore = this.dataStore
                                .slice(0, index)
                                .concat(this.dataStore.slice(++index))
    }
    
    
    
    
    
   }

```