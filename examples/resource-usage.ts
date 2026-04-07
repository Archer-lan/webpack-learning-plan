/**
 * ResourceManager 使用示例
 * 
 * 演示如何使用 ResourceManager 获取学习资源
 */

import { ResourceManager } from '../src/core/ResourceManager';

// 创建 ResourceManager 实例
const resourceManager = new ResourceManager();

console.log('=== Webpack 学习资源管理示例 ===\n');

// 1. 获取推荐学习资源
console.log('1. 获取推荐学习资源：');
try {
  const resources = resourceManager.getRecommendedResources();
  console.log(`找到 ${resources.length} 个学习资源`);
  
  // 显示推荐资源
  const recommended = resources.filter(r => r.recommended);
  console.log(`其中推荐资源：${recommended.length} 个`);
  
  if (recommended.length > 0) {
    console.log('\n推荐资源示例：');
    recommended.slice(0, 3).forEach(r => {
      console.log(`  - [${r.type}] ${r.title}`);
      console.log(`    ${r.description}`);
      console.log(`    链接：${r.url}\n`);
    });
  }
} catch (error) {
  console.log('暂无学习资源文件');
}

// 2. 获取官方文档链接
console.log('\n2. 获取官方文档链接：');
try {
  const allDocs = resourceManager.getOfficialDocs();
  console.log(`找到 ${allDocs.length} 个文档链接`);
  
  const officialDocs = allDocs.filter(d => d.type === 'official');
  console.log(`其中官方文档：${officialDocs.length} 个`);
  
  // 搜索特定主题的文档
  console.log('\n搜索 "loader" 相关文档：');
  const loaderDocs = resourceManager.getOfficialDocs('loader');
  loaderDocs.slice(0, 3).forEach(doc => {
    console.log(`  - ${doc.title}`);
    console.log(`    ${doc.url}\n`);
  });
} catch (error) {
  console.log('暂无官方文档文件');
}

// 3. 获取常见问题解答
console.log('\n3. 获取常见问题解答：');
try {
  const faqs = resourceManager.getFAQ();
  console.log(`找到 ${faqs.length} 个常见问题`);
  
  // 按分类统计
  const categories = new Set(faqs.map(f => f.category));
  console.log(`分类数量：${categories.size}`);
  console.log(`分类列表：${Array.from(categories).join(', ')}`);
  
  if (faqs.length > 0) {
    console.log('\n常见问题示例：');
    faqs.slice(0, 2).forEach(faq => {
      console.log(`  Q: ${faq.question}`);
      console.log(`  A: ${faq.answer.substring(0, 100)}...`);
      console.log(`  分类：${faq.category}`);
      console.log(`  标签：${faq.tags.join(', ')}\n`);
    });
  }
} catch (error) {
  console.log('暂无FAQ文件');
}

// 4. 获取配置模板
console.log('\n4. 获取配置模板：');
try {
  const templates = resourceManager.getConfigTemplates();
  console.log(`找到 ${templates.length} 个配置模板`);
  
  // 按分类统计
  const categories = new Set(templates.map(t => t.category));
  console.log(`分类数量：${categories.size}`);
  console.log(`分类列表：${Array.from(categories).join(', ')}`);
  
  if (templates.length > 0) {
    console.log('\n配置模板示例：');
    templates.slice(0, 2).forEach(template => {
      console.log(`  - ${template.name} (${template.category})`);
      console.log(`    ${template.description}`);
      console.log(`    包含文件：${template.files.map(f => f.path).join(', ')}`);
      if (template.usage) {
        console.log(`    使用说明：${template.usage.substring(0, 80)}...`);
      }
      console.log();
    });
  }
} catch (error) {
  console.log('暂无配置模板目录');
}

console.log('=== 示例结束 ===');
