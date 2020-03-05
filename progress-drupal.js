'use strict';
const argv = require('yargs').argv
const puppeteer = require('puppeteer');

function generatePassword() {
    var length = 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
let passwword = generatePassword();

(async () => {
try {

  const browser = await puppeteer.launch({
    //args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://paneltest.dn.ua/', {waitUntil: 'networkidle0'});
  await page.screenshot({path: 'screenshot00.png'});
  function my_function(){
  page.screenshot({path: 'screenshots.png'});};
  //setInterval(my_function,5000);
  let setupConfigSelector = 'input[id=edit-submit]';
  if (await page.$(setupConfigSelector) === null) {
	  await browser.close();
	  throw "link to install/index.php (stage1) not found";
  }

  if(argv.language == "ru"){
    let setupInstallSelector = "#edit-langcode option:nth-child(59)";
    await page.evaluate((setupInstallSelector) => document.querySelector(setupInstallSelector).selected = "selected", setupInstallSelector);
  }else if(argv.language == "ua"){
    let setupInstallSelector = "#edit-langcode option:nth-child(62)";
    await page.evaluate((setupInstallSelector) => document.querySelector(setupInstallSelector).selected = "selected", setupInstallSelector);
  }

  await page.screenshot({path: 'screenshot1.png'});
  await Promise.all([page.click("#edit-submit"), page.waitForNavigation({waitUntil: 'load', timeout: 300000})]);

  setupConfigSelector = 'input[id=edit-submit]';
  if (await page.$(setupConfigSelector) === null) {
	  await browser.close();
	  throw "link to install/index.php (stage2) not found";
  }
  await page.screenshot({path: 'screenshot2.png'});
  await Promise.all([page.click("#edit-submit"), page.waitForNavigation({waitUntil: 'load', timeout: 300000})]);
  await page.screenshot({path: 'screenshot3.png'});
  setupConfigSelector = "//a[text()='продовжити у будь-якому разі']";
  if (await page.$x(setupConfigSelector) === null) {
	  await browser.close();
	  throw "link to install/index.php (stage3) not found";
  }
    await page.screenshot({path: 'screenshot4.png'});
    await Promise.all([page.click("a:nth-child(4)"), page.waitForNavigation({waitUntil: 'load', timeout: 300000})]);
  await page.screenshot({path: 'screenshot5.png'});

  setupConfigSelector = 'input[id=edit-mysql-database]';
  if (await page.$(setupConfigSelector) === null) {
	  await browser.close();
	  throw "link to install/index.php/step2 (stage4) not found";
  }
  await page.screenshot({path: 'screenshot6.png'});

  await page.evaluate( () => document.querySelector("input[id=edit-mysql-username]").value = "");
  await page.focus("input[id=edit-mysql-username]");
  await page.keyboard.type(argv.name);
  await page.screenshot({path: 'screenshot7.png'});
  await page.evaluate( () => document.querySelector("input[id=edit-mysql-database]").value = "");
  await page.focus("input[id=edit-mysql-database]");
  await page.keyboard.type(argv.user);
  await page.screenshot({path: 'screenshot8.png'});
  await page.evaluate( () => document.querySelector("input[id=edit-mysql-password]").value = "");
  await page.focus("input[id=edit-mysql-password]");
  await page.keyboard.type(argv.password);
  await page.screenshot({path: 'screenshot9.png'});

  await Promise.all([page.click("#edit-save"), page.waitForNavigation({waitUntil: 'load', timeout: 300000})]);
  await page.screenshot({path: 'screenshot10-1.png'});
  await page.waitFor(300000);


  await page.screenshot({path: 'screenshot10-2.png'});
  await page.focus("input[id=edit-site-name]");
  await page.keyboard.type(argv.sitename);
  await page.screenshot({path: 'screenshot13.png'});
  await page.focus("input[id=edit-site-mail]");
  await page.keyboard.type(argv.mail);
  await page.screenshot({path: 'screenshot14.png'});
  await page.focus("input[id=edit-account-name]");
  await page.keyboard.type("admin");
  await page.screenshot({path: 'screenshot15.png'});
  await page.focus("input[id=edit-account-pass-pass1]");
  await page.keyboard.type(passwword);
  await page.screenshot({path: 'screenshot16.png'});
  await page.focus("input[id=edit-account-pass-pass2]");
  await page.keyboard.type(passwword);
  await page.screenshot({path: 'screenshot17.png'});
  await Promise.all([page.click("#edit-submit"), page.waitForNavigation({waitUntil: 'load', timeout: 300000})]);
  await page.screenshot({path: 'screenshot18.png'});
  await page.waitForSelector("#block-bartik-page-title");
  await page.screenshot({path: 'screenshot19.png'});
  let response = {};
  response.status = "success";
  response.newPassword = passwword;
  console.log(JSON.stringify(response));
  await browser.close();
	}catch (err) {
	let response = {};
    response.status = "error";
    response.error = err;
	  console.log(response);
  }
})();
