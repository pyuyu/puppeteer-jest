const puppeteer = require('puppeteer');
var path = require("path");
var urlencode = require('urlencode');
const cookies = require('./cookie');


let chName = '郑州迎云实业有限公司'
let browser
(async () => {
  browser = await puppeteer.launch({
  // executablePath: path.join(__dirname, './chromium/Chromium.app/Contents/MacOS/Chromium'),
  // 关闭headless模式, 会打开浏览器
  headless: false,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

  await qcc(chName);
})();

async function qcc(chName){
  try{
    const page = await browser.newPage();
    for(let i = 0; i < cookies.length; i++){
      await page.setCookie(cookies[i])
    }
  
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`https://www.qcc.com/search?key=${urlencode(chName)}`, {timeout:60000, waitUntil: 'domcontentloaded'});
    const preloadHref = await page.$eval('.ma_h1', el => el.href);
    await page.goto(preloadHref, {timeout:60000, waitUntil: 'domcontentloaded'});

    try {
      let okButtonElement = await page.$('modal-footer .btn.btn-primary');
      await okButtonElement.click()
    } catch (error) {
      console.log('no button')
    }
  
    let element = await page.$('#company-top'); //企业详情
    await element.screenshot({
        path: `${path.resolve(__dirname,'../files')}/${chName}.png`
    });
  
    const addr = await page.$$eval('.row .cvlu a', els => els[els.length - 2].innerHTML);
    console.log(addr)
    process.exit();
  } catch(e){
    console.log('操作失败', e)
  }

}