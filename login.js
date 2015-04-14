//define login info
var info = require('./info.js');
var username = info.username;
var password = info.password;

var superagent = require('superagent');
var cheerio = require('cheerio');

var post_url = 'http://login.weibo.cn/login/';
var post_data = '{';

var querystring = require('querystring');
var http = require('http');
var url = require('url');

function Login(){

};

module.exports = Login;

Login.getCookie = function(callback){
	//get post data
	superagent.get('http://login.weibo.cn/login/',function(err,response){
		if(err){
			console.log("Error: " + err);
			return callback(err,null);
		}
		var $ = cheerio.load(response.text);

		post_url += $('form').attr('action');
		//sconsole.log(post_url);

		$('input').each(function(index,element){
			var name = $(element).attr('name');
			var value = $(element).attr('value');
			
			if(name.indexOf('mobile') != -1)
				value = username;
			if(name.indexOf('password') != -1)
				value = password;
			if(name.indexOf('remember') != -1)
				value = 'on';

			post_data += '"' + name + '":"' + value + '",';
			
			//console.log(name);
			//console.log(value);
		});
		post_data += '"name":"zhang"}';
		var postData = querystring.stringify(JSON.parse(post_data));
		//console.log(postData);
		
		//login
		var post_url_obj = url.parse(post_url);
		//console.log(post_url_obj);

		var options = {
			hostname: post_url_obj.hostname,
			port: 80,
			path: post_url_obj.path,
			method: 'POST',
			headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
			}
		};

		var req = http.request(options, function(res) {
			//get cookie
			//console.log(res.statusCode);
			var set_cookie = res.headers['set-cookie'];
			//console.log(set_cookie);
			var cookies = '';
			set_cookie.forEach(function(ele){
				//console.log(ele);
				cookies += ele.split(';')[0]+';';
			});
			
			return callback(null,cookies);
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			return callback(e,null);
		});

		// write data to request body
		req.write(postData);
		req.end();

	});
};

