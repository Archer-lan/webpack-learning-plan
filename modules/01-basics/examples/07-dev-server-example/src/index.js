import './styles.css';

const app = document.getElementById('app');
app.innerHTML = `
  <h1>Webpack Dev Server 示例</h1>
  <p>尝试修改这段文字，保存后浏览器会自动刷新！</p>
  <p>当前时间：${new Date().toLocaleTimeString()}</p>
`;

console.log('Dev Server 运行中...');
