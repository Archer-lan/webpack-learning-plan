// 这是一个用于演示不同模式的示例
function greet(name) {
  return `Hello, ${name}!`;
}

function calculate(a, b) {
  return a + b;
}

// 未使用的函数（在 production 模式下会被 tree shaking 移除）
function unusedFunction() {
  console.log('This function is never called');
}

console.log(greet('Webpack'));
console.log('计算结果:', calculate(10, 20));
console.log('当前模式:', process.env.NODE_ENV);
