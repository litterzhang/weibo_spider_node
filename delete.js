var fs = require('fs');

var files = fs.readdirSync('./data');

files.forEach(function(file){
		
	var content = fs.readFileSync('./data/' + file);
	var reg = /[0-9]+/;

	console.log(content.length);
	//console.log(reg.test(file));
	if(reg.test(file) && content.length < 200)
		fs.unlinkSync('./data/' + file);
	
	//console.log(file);
});

var files = fs.readdirSync('./data');
console.log("file count: " + files.length);