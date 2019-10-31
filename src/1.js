const path = require('path');
const puppeteer = require('puppeteer');

const log = console.log;
(async () => {
  const browser = await puppeteer.launch({
    // executablePath: path.join(__dirname, './chromium/Chromium.app/Contents/MacOS/Chromium'),
    // 关闭headless模式, 会打开浏览器
    headless: false,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.goto('https://www.jianshu.com');
  await autoScroll(page);

  // fullPage截图
  await page.screenshot({
    path: 'auto_scroll.png',
    type: 'png',
    fullPage: true,
  });
})();

async function autoScroll(page) {
  log('[AutoScroll begin]');
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      // 页面的当前高度
      let totalHeight = 0;
      // 每次向下滚动的距离
      let distance = 100;
      // 通过setInterval循环执行
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;

        // 执行滚动操作
        window.scrollBy(0, distance);

        // 如果滚动的距离大于当前元素高度则停止执行
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  log('[AutoScroll done]');
  // 完成懒加载后可以完整截图或者爬取数据等操作
  // do what you like ...
}