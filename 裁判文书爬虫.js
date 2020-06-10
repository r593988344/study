'use strict'

// 引入 fs 模块
const fs = require('fs');

// 引入 xlsx 模块
const xlsx = require('node-xlsx').default;

// 引入核心 puppeteer
// npm install puppeteer --ignore-scripts
// 如果不加 --ignore-scripts 会报错, 因为它要下载 chormium, 国内网络环境是搞不下来, 除非挂代理
const puppeteer = require('puppeteer');

(async () => {
  // 设定 puppetter 启动参数
  // 主要是要配置 chrome.exe 的路径 文章后边会给下载链接
  const browser = await puppeteer.launch({
    // 把安装后的 chrome 路径填到下面
    executablePath: './chrome-win/chrome.exe',
    // 是否开启无头模式, 可以理解为是否有可视的浏览器界面
    headless: false, // 开启界面
    // defaultViewport: null,
    // slowMo: 80,
  });
  // 新建一个网页
  const page = await browser.newPage();
  // 跳转至文书网
  await page.goto('https://wenshu.court.gov.cn/');
  // waitForSelector 等待 目标 渲染出来
  await page.waitForSelector('#_view_1540966814000 > div > div.search-wrapper.clearfix > div.advenced-search');
  // 模拟点击高级检索
  await page.click('#_view_1540966814000 > div > div.search-wrapper.clearfix > div.advenced-search');
  // 配置全文检索的关键词
  const searchText = '安全';
  // 全文检索关键字
  await page.type('#qbValue', searchText);
  // 点击全文检索类型
  await page.click('#qbType');
  // 选择理由
  await page.click('#qwTypeUl > li:nth-child(6)');

  // // 案件类型
  await page.click('#selectCon_other_ajlx');
  // 民事案件
  await page.click('#gjjs_ajlx > li:nth-child(4)');
  // 行政案件
  await page.click('#gjjs_ajlx > li:nth-child(5)');
  // 文书类型
  await page.click('#_view_1540966814000 > div > div.advencedWrapper > div.inputWrapper.clearfix > div:nth-child(9) > div > div > div');
  // 判决书
  await page.click('#gjjs_wslx > li:nth-child(3)');
  // 裁决书
  await page.click('#gjjs_wslx > li.on');
  // 年份开始（2017-01-01）
  await page.type('#cprqStart', '2017-01-01');
  // 年份结束（2020-12-31）
  await page.type('#cprqEnd', '2020-12-31');
  //当事人
  await page.type('#s17', '');

  // 点击检索
  await page.click('#searchBtn');

  await page.waitForSelector('#_view_1545184311000 > div.left_7_3 > div > select');

  // 页容量改为15, 这样从一个页面采集的数量比较多
  await page.select('#_view_1545184311000 > div.left_7_3 > div > select', '15');
  // 等待 页面内容刷出
  await page.waitFor(500);
  // 设置起始页数
  let pageNum = 1;
  // 设置 excel 表头
  const data = [['DocID','案号', '标题', '案件类型', '当事人', '案由', 'pdf内容', 'html内容']];
  let i = 1;
  // while 里面配置采集多少页
  while (pageNum < 2) {
    pageNum++;
    // 获取页面列表数据区域
    const view = await page.$('#_view_1545184311000');
    const lists = await view.$$('.LM_list');

    // 循环数据列表
    for (const list of lists) {
      try {
        // 获取列表汇总每个信息的超链
        const href = await list.$('div.list_title.clearfix > h4 > a');
        // 获取指向的地址
        let href_url = await href.evaluate(node => node.href);
        // 根据 href_url 获取 docid, docID 即为文书编号, 这里使用正则
        let docid = href_url.match(/docId=(\S*)/)[1];

        // 获取文书的案号
        let ah = await list.$('div.list_subtitle > span.ah');
        // 后边会经常用到这个方法, innerText 用以获取 字符串
        ah = await ah.evaluate(node => node.innerText);
        // 点击详情页链接
        await href.click();
        // 等待加载
        await page.waitFor(500);
        // 第二个标签页的数据
        const page2 = (await browser.pages())[2];
        // xpath 获取 title
        let title = await page2.$('#_view_1541573883000 > div > div.PDF_box > div.PDF_title');
        title = title !== null ? await title.evaluate(node => node.innerText) : '';
        // 获取 案件类型
        let ajlx = await page2.$('#_view_1541573889000 > div:nth-child(1) > div.right_fixed > div.gaiyao_box > div.gaiyao_center > ul > li:nth-child(1) > h4:nth-child(2) > a');
        ajlx = ajlx !== null ? await ajlx.evaluate(node => node.innerText) : '';
        // 获取 案件原因
        let reason = await page2.$('#_view_1541573889000 > div:nth-child(1) > div.right_fixed > div.gaiyao_box > div.gaiyao_center > ul > li:nth-child(1) > h4:nth-child(3) > a');
        reason = reason !== null ? await reason.evaluate(node => node.innerText) : '';
        // 获取 client
        let client = await page2.$('#_view_1541573889000 > div:nth-child(1) > div.right_fixed > div.gaiyao_box > div.gaiyao_center > ul > li:nth-child(1) > h4:nth-child(6) > b');
        client = client !== null ? await client.evaluate(node => node.innerText) : '';
        // 获取内容
        let content = await page2.$('#_view_1541573883000 > div > div.PDF_box');
        content = content !== null ? await content.evaluate(node => node.innerText) : '';
        // 获取 html , 可以根据这个去写进一步逻辑 获取内容的细分的字段
        let html = await page2.$('#_view_1541573883000 > div > div.PDF_box');
        html = html !== null ? await html.evaluate(node => node.innerHTML) : '';
        // push 进数据池
        data.push([docid, ah, title, ajlx, client, reason, content, html]);
        console.log(`${i++}:${ah}`);
        // 这个页面的数据获取后 关闭 这个标签页
        await page2.close();
      } catch (error) {
        console.log(i++);
        console.error('error:', error);
        continue;
      }
    }
    try {
      // 当本页面数据采集完后点击分页
      await page.click(`#_view_1545184311000 > div.left_7_3 > a:nth-child(${pageNum + 1})`);
    } catch (error) {
      console.error('error:', error);
      continue;
    }
    await page.waitFor(500);
  }
  // 整体采集完后关闭浏览器
  await browser.close();
  // 新建 xlsx 文件, 进行相应配置
  const buffer = xlsx.build([
    {
      name: 'sheet1',
      data,
    }
  ]);
  // fs 方法写入内容
  fs.writeFileSync('文书'+Date.now()+'.xlsx', buffer, { 'flag': 'w' });
})();
