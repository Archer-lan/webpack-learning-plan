import './styles.css';
// TODO: 导入图片
// 例如：import image1 from './images/photo1.jpg';

const app = document.getElementById('app');

// TODO: 创建图片画廊
// 提示：
// 1. 创建一个包含标题的 div
// 2. 创建一个 gallery 容器
// 3. 为每张图片创建 img 元素，设置 src 为导入的图片 URL
// 4. 将图片添加到 gallery 容器中

app.innerHTML = `
  <h1>我的图片画廊</h1>
  <div class="gallery">
    <!-- 在这里添加图片 -->
  </div>
`;

// 如果没有实际图片，可以使用占位图片
// 例如：<img src="https://via.placeholder.com/300" alt="图片1">
