function run() {
    // 修改全局 Object.prototype，使对象可以被解构
    Object.defineProperty(Object.prototype, Symbol.iterator, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: function* () {
            for (let key of Object.keys(this)) {
                yield this[key];
            }
        }
    });
}

run();
const [a, b] = {a: 1, b: 2};
console.log(a, b); // 输出 1 2