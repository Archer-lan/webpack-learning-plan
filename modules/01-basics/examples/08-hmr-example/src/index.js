import './styles.css';
import { greet } from './greet.js';

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1>模块热替换（HMR）示例</h1>
    <div class="message">${greet()}</div>
    <p>尝试修改 greet.js 中的文字，页面会无刷新更新！</p>
    <p>尝试修改 styles.css 中的样式，样式会立即更新！</p>
  `;
}

render();

// 启用 HMR
if (module.hot) {
  module.hot.accept('./greet.js', () => {
    console.log('✅ Greet 模块已更新！');
    render();
  });
  
  module.hot.accept('./styles.css', () => {
    console.log('✅ 样式已更新！');
  });
}
