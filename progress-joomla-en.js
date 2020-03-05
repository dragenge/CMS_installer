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
  let setupConfigSelector = 'form[action=index\\.php]';
  if (await page.$(setupConfigSelector) === null) {
	  await page.screenshot({path: 'screenshot0.png'});
	  await browser.close();
	  throw "link to installation/index.php?view=site (stage1) not found";
  }

  await page.waitFor(1000);
  await page.screenshot({path: 'screenshot1.png'});

  await page.focus("input[id=jform_site_name]");
  await page.keyboard.type(argv.sitename.split('_').join(' '));
  await page.screenshot({path: 'screenshot1.png'});
  await page.focus("input[id=jform_admin_email]");
  await page.keyboard.type(argv.mail);
  await page.screenshot({path: 'screenshot2.png'});
  await page.focus("input[id=jform_admin_user]");
  await page.keyboard.type("admin");
  await page.screenshot({path: 'screenshot3.png'});
	await page.focus("input[id=jform_admin_password]");
  await page.keyboard.type(passwword);
  await page.screenshot({path: 'screenshot4.png'});
	await page.focus("input[id=jform_admin_password2]");
  await page.keyboard.type(passwword);
  await page.screenshot({path: 'screenshot5.png'});

  await page.evaluate(() => {document.querySelector("a.btn.btn-primary").click()});
	setupConfigSelector = 'form[id=adminForm]';
  await page.waitFor(1000);

	await page.screenshot({path: 'screenshot5-5.png'});
  if (await page.$(setupConfigSelector) === null) {
	  await page.screenshot({path: 'screenshot0.png'});
	  await browser.close();
	  throw "Instalation1 (stage2) failed";
  }

	await page.screenshot({path: 'screenshot6.png'});
	await page.focus("input[id=jform_db_user]");
  await page.keyboard.type(argv.user);
  await page.screenshot({path: 'screenshot7.png'});
  await page.focus("input[id=jform_db_pass]");
  await page.keyboard.type(argv.password);
  await page.screenshot({path: 'screenshot8.png'});
  await page.focus("input[id=jform_db_name]");
  await page.keyboard.type(argv.name);
  await page.screenshot({path: 'screenshot9.png'});

  await page.evaluate(() => {document.querySelector("a.btn.btn-primary").click()});
  await page.waitFor(1000)
	await page.screenshot({path: 'screenshot10-5.png'});

  if(await page.$(setupConfigSelector) === null) {
	  await page.screenshot({path: 'screenshot0.png'});
	  await browser.close();
	  throw "Instalation2 (stage3) failed";
	}

	await page.screenshot({path: 'screenshot11.png'});
	await page.evaluate(() => {document.querySelector("a.btn.btn-primary").click()});
	await page.waitFor(2000);
	await page.waitForSelector("div[class=span6]");
	await page.screenshot({path: 'screenshot12.png'});

  await page.click("#instLangs");
  await page.waitFor(1000)
  await page.waitForSelector("#cb58");

  await page.screenshot({path: 'screenshot13.png'});
  if(argv.language == "ru"){
    await page.click("#cb58");
  }else if(argv.language == "ua"){
    await page.click("#cb73");
  }

  await page.screenshot({path: 'screenshot14.png'});
  await page.evaluate(() => {document.querySelector("a.btn.btn-primary").click()});
  await page.screenshot({path: 'screenshot14-0.png'});
  await page.waitFor(1000);
  await page.waitForSelector("#admin-language-cb1");
  await page.click("#admin-language-cb1");
  await page.click("#site-language-cb1");

  await page.screenshot({path: 'screenshot14-1.png'});
  await page.evaluate(() => {document.querySelector("a.btn.btn-primary").click()});
  await page.waitFor(1000);

  await page.waitForSelector(".btn.btn-warning");
  await page.screenshot({path: 'screenshot14-2.png'});
  await page.click(".btn.btn-warning");
  await page.waitFor(1000);
  await page.screenshot({path: 'screenshot15.png'});
  let response = {};
  response.status = "success";
  response.newPassword = passwword;
  console.log(JSON.stringify(response));
  await browser.close();

	}catch (err){
	let response = {};
    response.status = "error";
    response.error = err;
  	console.log(response);
  }
})();
