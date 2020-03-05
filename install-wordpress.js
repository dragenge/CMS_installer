const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    //args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://paneltest.dn.ua/', {waitUntil: 'networkidle0'});

  let setupConfigSelector = 'a[href*=setup\\-config\\.php]';
  if (await page.$(setupConfigSelector) === null) {
    console.log("link to setup-config.php not found");
    await browser.close();
  }
  await page.evaluate((setupConfigSelector) => document.querySelector(setupConfigSelector).click(), setupConfigSelector);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.evaluate( () => document.querySelector("form input[name=dbname]").value = "");
  await page.focus("form input[name=dbname]");
  await page.keyboard.type('cms_wordpress');

  await page.evaluate( () => document.querySelector("form input[name=uname]").value = "");
  await page.focus("form input[name=uname]");
  await page.keyboard.type('cms_wordpress');

  await page.evaluate( () => document.querySelector("form input[name=pwd]").value = "");
  await page.focus("form input[name=pwd]");
  await page.keyboard.type('cms_wordpress');

  let stepOneSubmitButton = "form input[type=submit]";
  await page.evaluate((stepOneSubmitButton) => document.querySelector(stepOneSubmitButton).click(), stepOneSubmitButton);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  let setupInstallSelector = 'a[href*=install\\.php]';
  if (await page.$(setupInstallSelector) === null) {
    console.log("link to install.php not found");
    await browser.close();
  }

  await page.evaluate((setupInstallSelector) => document.querySelector(setupInstallSelector).click(), setupInstallSelector);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  let formInstallStep2Selector = "form[action=install\\.php\\?step\\=2]";
  if (await page.$(formInstallStep2Selector) === null) {
    console.log("form with action=install.php?step=2 not found");
    await browser.close();
  }

  await page.focus(formInstallStep2Selector+" input[name=weblog_title]");
  await page.keyboard.type('Мой сайт');

  await page.focus(formInstallStep2Selector+" input[name=user_name]");
  await page.keyboard.type('admin');

  const passwordField = await page.$("input[name=pass1\\-text]");
  const adminPassword = await page.evaluate(passwordField => passwordField.value, passwordField);

  await page.focus(formInstallStep2Selector+" input[name=admin_email]");
  await page.keyboard.type('igor.kul.87@gmail.com');

  let formInstallStep2SubmitSelector = formInstallStep2Selector+" input[type=submit]";
  await page.evaluate((formInstallStep2SubmitSelector) => document.querySelector(formInstallStep2SubmitSelector).click(), formInstallStep2SubmitSelector);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  console.log(adminPassword);

  await page.screenshot({path: 'screenshot.png'});

  await browser.close();
})();
