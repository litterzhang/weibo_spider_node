//main
var Login = require('./login.js');
var http = require('http');
var info = require('./info.js');
var user = require('./getUser.js');
var fs = require('fs');
var page = require('./getPage.js');

var next = function(){
	if(info.urls_waiting.length == 0)
		return;
	var url = info.urls_waiting.pop();
	if(info.urls_waiting.length != 0)
		fs.writeFileSync('./data/start' , info.urls_waiting[0]);
	else
		fs.writeFileSync('./data/start' , url);
	user(url,function(err){
		if(err)
			console.log(err);
		next();
	});
};

var cookies_t = fs.readFileSync('./data/cookies').toString();
if(cookies_t != null && cookies_t.length != 0 && cookies_t != undefined){
	info.cookies = cookies_t;
	console.log(info);
	var data = fs.readFileSync('./data/start').toString();
	info.urls_waiting.push(data);
	next();
	
}
else{
	Login.getCookie(function(err,cookies){
		if(err)
			console.log(err);
		else{
			info.cookies = cookies;
			fs.writeFileSync('./data/cookies' , cookies);
		}

		console.log(info);
		var data = fs.readFileSync('./data/start').toString();
		info.urls_waiting.push(data);
		next();
		
	});	
}
