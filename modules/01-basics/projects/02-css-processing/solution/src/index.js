import './base.css';
import './card.css';

const app = document.getElementById('app');
app.innerHTML = `
  <div class="card">
    <h1 class="name">张三</h1>
    <p class="title">前端开发工程师</p>
    <p class="bio">热爱编程，专注于 Web 前端技术。擅长 JavaScript、React、Vue 等现代前端框架。</p>
  </div>
`;
