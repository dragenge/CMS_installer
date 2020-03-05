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
  try {await page.waitForSelector("#btNext",{ timeout: 60000});}
  catch{
    await browser.close();
    console.log("Timeout Error - 1 min");
  }
  await page.screenshot({path: 'screenshot00.png'});

  let setupConfigSelector = 'input[id=btNext]';
  if (await page.$(setupConfigSelector) === null) {
	  await browser.close();
	  throw "link to install/index.php (stage1) not found";
  }

  if(argv.language == "ru"){
    let setupInstallSelector = "#langList option:nth-child(33)";
    await page.evaluate((setupInstallSelector) => document.querySelector(setupInstallSelector).selected = "selected", setupInstallSelector);
  }else if(argv.language == "ua"){
    let setupInstallSelector = "#langList option:nth-child(34)";
    await page.evaluate((setupInstallSelector) => document.querySelector("#langList option:nth-child(34)").selected = "selected", setupInstallSelector);
  }
  page.evaluate(() => {$('#mainForm').submit();});
  await page.waitForNavigation()
  await page.screenshot({path: 'screenshot1.png'});
  try {await Promise.all([page.click("#btNext"), page.waitForNavigation({waitUntil: 'load', timeout: 60000})]);}
  catch{
    await browser.close();
    console.log("Timeout Error - 1 min");
  }
  setupConfigSelector = 'input[id=btNext]';
  if (await page.$(setupConfigSelector) === null) {
	  await browser.close();
	  throw "link to install/index.php (stage2) not found";
  }
  await page.click("#set_license")

  await page.screenshot({path: 'screenshot2.png'});
  try {await Promise.all([page.click("#btNext"), page.waitForNavigation({waitUntil: 'load', timeout: 60000})]);}
  catch{
    await browser.close();
    console.log("Timeout Error - 1 min");
  }
  await page.screenshot({path: 'screenshot3.png'});

  await page.evaluate( () => document.querySelector("input[id=infosShop]").value = "");
  await page.focus("input[id=infosShop]");
  await page.keyboard.type(argv.name);
  await page.screenshot({path: 'screenshot7.png'});
  await page.click("#infosShopBlock div:nth-child(5) div");
  await page.click("#infosCountry_chosen div ul li:nth-child(231)");

  await page.evaluate( () => document.querySelector("input[id=infosFirstname]").value = "");
  await page.focus("input[id=infosFirstname]");
  await page.keyboard.type("Admin");

  await page.evaluate( () => document.querySelector("input[id=infosName]").value = "");
  await page.focus("input[id=infosName]");
  await page.keyboard.type("Admin");

  await page.evaluate( () => document.querySelector("input[id=infosEmail]").value = "");
  await page.focus("input[id=infosEmail]");
  await page.keyboard.type(argv.mail);

  await page.screenshot({path: 'screenshot8.png'});

  await page.evaluate( () => document.querySelector("input[id=infosPassword]").value = "");
  await page.focus("input[id=infosPassword]");
  await page.keyboard.type(passwword);
  await page.screenshot({path: 'screenshot9.png'});

  await page.evaluate( () => document.querySelector("input[id=infosPasswordRepeat]").value = "");
  await page.focus("input[id=infosPasswordRepeat]");
  await page.keyboard.type(passwword);
  await page.screenshot({path: 'screenshot10.png'});

  try{await Promise.all([page.click("#btNext"), page.waitForNavigation({waitUntil: 'load', timeout: 60000})]);}
  catch{
    await browser.close();
    console.log("Timeout Error - 1 min");
  }
  await page.screenshot({path: 'screenshot10-1.png'});



  await page.evaluate( () => document.querySelector("input[id=dbName]").value = "");
  await page.focus("input[id=dbName]");
  await page.keyboard.type(argv.name);
  await page.screenshot({path: 'screenshot11.png'});

  await page.evaluate( () => document.querySelector("input[id=dbLogin]").value = "");
  await page.focus("input[id=dbLogin]");
  await page.keyboard.type(argv.user);
  await page.screenshot({path: 'screenshot12.png'});

  await page.evaluate( () => document.querySelector("input[id=dbPassword]").value = "");
  await page.focus("input[id=dbPassword]");
  await page.keyboard.type(argv.password);
  await page.screenshot({path: 'screenshot13.png'});

  try{await Promise.all([page.click("#btNext"), page.waitForNavigation({waitUntil: 'load', timeout: 60000})]);}
  catch{
    await browser.close();
    console.log("Timeout Error - 1 min");
  }

  await page.screenshot({path: 'screenshot14.png'});
  try{await page.waitFor(200000);}
  catch{
    await browser.close();
    console.log("Timeout Error");
  }
  await page.screenshot({path: 'screenshot15.png'});
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
