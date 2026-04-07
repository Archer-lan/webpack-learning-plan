import './styles.css';

const app = document.getElementById('app');

// 使用占位图片服务创建图片画廊
const images = [
  { url: 'https://via.placeholder.com/300/667eea/ffffff?text=Image+1', alt: '图片 1' },
  { url: 'https://via.placeholder.com/300/764ba2/ffffff?text=Image+2', alt: '图片 2' },
  { url: 'https://via.placeholder.com/300/f093fb/ffffff?text=Image+3', alt: '图片 3' },
  { url: 'https://via.placeholder.com/300/4facfe/ffffff?text=Image+4', alt: '图片 4' },
  { url: 'https://via.placeholder.com/300/00f2fe/ffffff?text=Image+5', alt: '图片 5' },
  { url: 'https://via.placeholder.com/300/43e97b/ffffff?text=Image+6', alt: '图片 6' }
];

const galleryHTML = images.map(img => 
  `<div class="gallery-item">
    <img src="${img.url}" alt="${img.alt}">
  </div>`
).join('');

app.innerHTML = `
  <h1>我的图片画廊</h1>
  <div class="gallery">
    ${galleryHTML}
  </div>
`;

console.log('图片画廊加载完成');
