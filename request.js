exports.add = function(first){

const { exec } = require('child_process');
	let cms_property = "";
	let cms_type;
            for (var key in first) {
                if (first.hasOwnProperty(key)) {
                    cms_property =  cms_property +" --"+key + "=" + first[key]; //parse all args into one executable string for yargs
				if (key = "cms"){
					cms_type = first[key]; //checking choosed cms
                }
				}
            }
let execution;
cms_type = parseInt(cms_type, 10); //convert string to number
switch(cms_type){
case 0:	execution = "node wp-install.js "+ cms_property; console.log("CMS1");  //choosing CMS file
break;
case 1:	 execution = "node wp-install-ru.js "+ cms_property;console.log("CMS2");
break;
case 2:	execution = "node progress-joomla-en.js"+ cms_property;console.log("CMS3");
break;
case 3:	execution = "node progress-oc.js "+ cms_property;console.log("CMS4");
break;
case 4:	execution = "node progress-drupal.js "+ cms_property;console.log("CMS5");
break;
case 5:	execution = "node progress-presta.js "+ cms_property;console.log("CMS6");
break;
}
exec(execution, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`${stdout}`);
  console.error(`stderr: ${stderr}`);
});
};
