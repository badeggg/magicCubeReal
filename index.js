//2015/8/11 start
var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'magicCubeReal.html'));
});
app.listen(3000);





















