var superagent = require('superagent');
var info = require('./info.js');

function Page(){

};

module.exports = Page;

Page.get = function(url,callback){
	superagent.get(url)
		.set('Cookie',info.cookies)
		.end(function(err,res){
			if(err){
				console.log(err);
				return callback(err,null);
			}
			if(res.status == 200)
				return callback(null,res.text);
			else 
				return callback("Error StatusCode",null);
		});

};