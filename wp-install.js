'use strict';
const argv = require('yargs').argv
const puppeteer = require('puppeteer');

(async () => {
try {	
  const browser = await puppeteer.launch({
    //args: ['--no-sandbox']
  });
 
  const page = await browser.newPage();
  await page.goto(argv.uri, {waitUntil: 'networkidle0'});

  let setupConfigSelector = 'a[href*=setup\\-config\\.php]';
  if (await page.$(setupConfigSelector) === null) {
	  return false
	  throw "link to setup-config.php (stage1) not found";
	  
  }
  await page.evaluate((setupConfigSelector) => document.querySelector(setupConfigSelector).click(), setupConfigSelector);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.evaluate( () => document.querySelector("form input[name=dbname]").value = "");
  await page.focus("form input[name=dbname]");
  await page.keyboard.type(argv.name);

  await page.evaluate( () => document.querySelector("form input[name=uname]").value = "");
  await page.focus("form input[name=uname]");
  await page.keyboard.type(argv.user);

  await page.evaluate( () => document.querySelector("form input[name=pwd]").value = "");
  await page.focus("form input[name=pwd]");
  await page.keyboard.type(argv.password);

  let stepOneSubmitButton = "form input[type=submit]";
  await page.evaluate((stepOneSubmitButton) => document.querySelector(stepOneSubmitButton).click(), stepOneSubmitButton);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

	
  let setupInstallSelector = 'a[href*=install\\.php]';
  if (await page.$(setupInstallSelector) === null) {
	  await browser.close();
	  throw "link to setup-config.php?step=2 (stage2) not found";
  }
  await page.evaluate((setupInstallSelector) => document.querySelector(setupInstallSelector).click(), setupInstallSelector);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

 let formInstallStep2Selector = "form[action=install\\.php\\?step\\=2]";
  if (await page.$(formInstallStep2Selector) === null) {
	  await browser.close();
	 throw "form with action=install.php?step=2 (stage3) not found";
  }	
  await page.focus(formInstallStep2Selector+" input[name=weblog_title]");
  await page.keyboard.type(argv.sitename.split('_').join(' '));

  await page.focus(formInstallStep2Selector+" input[name=user_name]");
  await page.keyboard.type('admin');

  const passwordField = await page.$("input[name=pass1\\-text]");
  const adminPassword = await page.evaluate(passwordField => passwordField.value, passwordField);

  await page.focus(formInstallStep2Selector+" input[name=admin_email]");
  await page.keyboard.type(argv.mail);

  let formInstallStep2SubmitSelector = formInstallStep2Selector+" input[type=submit]";
  await page.evaluate((formInstallStep2SubmitSelector) => document.querySelector(formInstallStep2SubmitSelector).click(), formInstallStep2SubmitSelector);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
	let response = {};
	response.status = "success";
	response.newPassword = adminPassword;
	console.log(JSON.stringify(response));
  await browser.close();

	}catch (err) {
	let response = {};
    response.status = "error";
    response.error = err;
	console.log(response);
  }
	
})();

		
