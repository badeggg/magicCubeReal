//2015/8/11 start
var express = require('express');
var path = require('path');
var mysql = require('mysql');
var server = require('./lib/server.js');
var multer = require('multer');
var upload = multer();

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'freedom',
	database: 'magiccube'
});

var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'magicCubeReal.html'));
});
app.post('/signIn', upload.array(), function(req, res){
	server.check({
			req: req,
			res: res,
			db: db,
			username: req.body.signInUsername,
			password: req.body.signInPassword,
			callback: function(req, res, result){
				res.end( JSON.stringify({result: result, username: req.body.signInUsername}) );
			}
	});
});
app.post('/checkUsername', function(req, res){
	req.body = '';
	req.on('data', function(data){
		req.body += data;
	});
	req.on('end', function(){
		req.body = JSON.parse( req.body.toString() );
		server.check({
			req: req,
			res: res,
			db: db,
			username: req.body.username,
			callback: function(req, res, result){
				res.end( JSON.stringify({result: result}) );
			}			
		});
	});
});
app.post('/checkEmail', function(req, res){
	req.body = '';
	req.on('data', function(data){
		req.body += data;
	});
	req.on('end', function(){
		req.body = JSON.parse( req.body.toString() );
		server.check({
			req: req,
			res: res,
			db: db,
			email: req.body.email,
			callback: function(req, res, result){
				res.end( JSON.stringify({result: result}) );
			}
		});
	});
});
app.listen(3000);





















