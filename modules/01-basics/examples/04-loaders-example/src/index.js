import './styles.css';

console.log('Loader 示例加载完成');

// 创建内容
const app = document.getElementById('app');
app.innerHTML = `
  <h1>Webpack Loader 示例</h1>
  <p>CSS 样式已通过 style-loader 和 css-loader 加载</p>
  <div class="box">这是一个带样式的盒子</div>
`;
