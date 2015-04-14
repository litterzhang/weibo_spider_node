var page = require('./getPage.js');
var info = require('./info.js');
var async = require('async');
var http = require('http');
var cheerio = require('cheerio');
var URL = require('url');
var fs = require('fs');

var getUser = function(url,callback){

	if(!info.user_url_reg.test(url))
		return callback("Error Url");
	var user_id = url.split('/')[4];
	
	if(fs.existsSync('./data/' + user_id))
		return callback("File Already Exist");

	var urls_at = [];

	page.get(url,function(err,page_content){
		if(err)
			return callback(err);

		//console.log(page_content);
		var $ = cheerio.load(page_content);

		var page_max = $('input[name=mp]').attr('value');
		if(page_max > 200)
			page_max = 200;

		fs.writeFileSync('./data/' + user_id , $('div.ut span.ctt').text() + '\n');

		var urls = [];
		for(var i = 1;i <= page_max;i++)
			urls.push(url + '?page=' + i);
		console.log(urls.length);
		
		async.eachLimit(urls,10,function(_url,callback){
			page.get(_url,function(err,content){
				if(err)
					return callback(err);

				$ = cheerio.load(content);
				
				if(urls_at.length < 100){
					$('a').each(function(index,element){
						var href = $(element).attr('href');

						var url_new = URL.resolve(_url,href);
						if(info.user_at_reg.test(url_new) && urls_at.indexOf(url_new) == -1)
							urls_at.push(url_new);
						
					});
				}
					
				$('div.c').each(function(index,element){
					if($(element).attr('id') != undefined)
						fs.appendFileSync('./data/' + user_id, $(element).attr('id') + ' ' + $(element).text() + '\n');
				});
				

				callback();
			});
		},function(err){
			console.log('status get finished');
			if(info.urls_waiting.length < 1000){
				async.eachLimit(urls_at,10,function(__url,callback){
					var __url_obj = URL.parse(__url);
					//console.log(__url);

					var options = {
						hostname: __url_obj.hostname,
						port: 80,
						path: __url_obj.path,
						method: 'GET',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						}
					};

					http.request(options, function(res) {
						if(res.statusCode == 302){
							var __url_wait = 'http://weibo.cn' + res.headers.location;
							if(info.user_url_reg.test(__url_wait))
								info.urls_waiting.push(__url_wait);
						
						}
						callback();
					}).end();
		
				},function(err){
					return callback(err);
				});
			}			
		});

	});
};

module.exports = getUser;