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
  let setupConfigSelector = 'form[action=index\\.php\\?route\\=install\\/step\\_1]';
  if (await page.$(setupConfigSelector) === null) {
	  return false
	  throw "link to install/index.php (stage1) not found";
  }
  await page.screenshot({path: 'screenshot1.png'});
  let stepOneSubmitButton = "button.btn.btn-default.dropdown-toggle";

  await Promise.all([page.click("input.btn.btn-primary"), page.waitForNavigation()]);
  await page.screenshot({path: 'screenshot3.png'});
  setupConfigSelector = 'form[action=index\\.php\\?route\\=install\\/step\\_2]';
  if (await page.$(setupConfigSelector) === null) {
	  return false
	  throw "link to install/index.php/step2 (stage2) not found";
  }

  await Promise.all([page.click("input.btn.btn-primary"), page.waitForNavigation()]);
  setupConfigSelector = 'form[action=index\\.php\\?route\\=install\\/step\\_3]';
  if (await page.$(setupConfigSelector) === null) {
    return false
    throw "Error - system misconfiguration (stage3)";
  }
  await page.screenshot({path: 'screenshot3.png'});

  await page.evaluate( () => document.querySelector("input[name=db_username]").value = "");
  await page.focus("input[name=db_username]");
  await page.keyboard.type(argv.name);
  await page.screenshot({path: 'screenshot4.png'});
  await page.evaluate( () => document.querySelector("input[name=db_database]").value = "");
  await page.focus("input[name=db_database]");
  await page.keyboard.type(argv.user);
  await page.screenshot({path: 'screenshot5.png'});
  await page.evaluate( () => document.querySelector("input[name=db_password]").value = "");
  await page.focus("input[name=db_password]");
  await page.keyboard.type(argv.password);
  await page.screenshot({path: 'screenshot6.png'});
  await page.focus("input[name=password]");
  await page.keyboard.type(passwword);
  await page.screenshot({path: 'screenshot7.png'});
  await page.focus("input[name=email]");
  await page.keyboard.type(argv.mail);
  await page.screenshot({path: 'screenshot8.png'});
  
  await Promise.all([page.click("input.btn.btn-primary"), page.waitForNavigation()]);
  await page.screenshot({path: 'screenshot9.png'});
  setupConfigSelector = 'i.fa.fa-cog.fa-5x.white';

  if (await page.$(setupConfigSelector) === null) {
    return false
    throw "Error - can't install opencart (stage4)";
  }

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
