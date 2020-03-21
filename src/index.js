const puppeteer = require('puppeteer');
const path = require("path");
const urlencode = require('urlencode');
const cookies = require('./cookie');
const xlsx = require('node-xlsx')

let browser
(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  let datas = await parseFile()

  for(let i = 0; i < Math.min(10, datas.length); i++ ){
    await qcc(datas[i]);  
  }
    
  process.exit();

})();

async function parseFile(){
  let sheets = xlsx.parse(path.resolve(__dirname,'../files/ddd.xlsx'));
  return datas = sheets[0].data.slice(1)
}

async function qcc(data){
  let [no, index, name, addrIndex, sendAddr, contact, phone, method, queryAddr, isSame, addrIndex2, ...orthers] = data
  try{
    const page = await browser.newPage();
    for(let i = 0; i < cookies.length; i++){
      await page.setCookie(cookies[i])
    }
  
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`https://www.qcc.com/search?key=${urlencode(name)}`, {timeout:60000, waitUntil: 'domcontentloaded'});
    const preloadHref = await page.$eval('.ma_h1', el => el.href);
    await page.goto(preloadHref, {timeout:60000, waitUntil: 'domcontentloaded'});

    try {
      let okButtonElement = await page.$('modal-footer .btn.btn-primary');
      await okButtonElement.click()
    } catch (error) {
    }
  
    let element = await page.$('#company-top'); //企业详情
    await element.screenshot({
        path: `${path.resolve(__dirname,'../files')}/${addrIndex}${name}.png`
    });
  
    const queryAddr = await page.$$eval('.row .cvlu a', els => els[els.length - 2].innerHTML);
    
    //输出 
    console.log(no, index, name, addrIndex, sendAddr, contact, phone, method, queryAddr, sendAddr.trim() == queryAddr.trim() ? '是' : '否', addrIndex2, ...orthers)
    page.close()
  } catch(e){
    console.log(`${no},${index},${name} 操作失败`, e)
  }

}