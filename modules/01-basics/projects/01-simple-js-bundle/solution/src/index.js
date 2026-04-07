import { add, subtract, multiply, divide } from './calculator.js';
import { formatResult } from './formatter.js';

console.log('计算结果：');

const a = 10;
const b = 5;

console.log(formatResult(a, '+', b, add(a, b)));
console.log(formatResult(a, '-', b, subtract(a, b)));
console.log(formatResult(a, '*', b, multiply(a, b)));
console.log(formatResult(a, '/', b, divide(a, b)));
