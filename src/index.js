const puppeteer = require('puppeteer');
var urlencode = require('urlencode');
const { cookie1, cookie2 , cookie3, cookie4, cookie5, cookie6, cookie7, cookie8, cookie9,cookie10} = require('./cookie');

(async () => {
  const browser = await puppeteer.launch({
    // executablePath: path.join(__dirname, './chromium/Chromium.app/Contents/MacOS/Chromium'),
    // 关闭headless模式, 会打开浏览器
    headless: false,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setCookie(cookie1)
  await page.setCookie(cookie2)
  await page.setCookie(cookie3)
  await page.setCookie(cookie4)
  await page.setCookie(cookie5)
  await page.setCookie(cookie6)
  await page.setCookie(cookie7)
  await page.setCookie(cookie8)
  await page.setCookie(cookie9)
  await page.setCookie(cookie10)

  await page.setViewport({ width: 1920, height: 1080 });

  let chName = '商丘市富园建筑劳务有限公司'
  
  await page.goto(`https://www.qcc.com/search?key=${urlencode(chName)}`);
  const preloadHref = await page.$eval('.ma_h1', el => el.href);
  page.goto(preloadHref);
  await page.waitForNavigation()

  let okButtonElement = await page.$('.btn.btn-primary');
  await okButtonElement.click()

  let element = await page.$('#company-top'); //企业详情
  await element.screenshot({
      path: '../files/element.png'
  });

  const addr = await page.$$eval('.row .cvlu a', els => els[els.length - 2].innerHTML);
  console.log(addr)

})();