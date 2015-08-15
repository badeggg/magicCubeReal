//2015/8/11 start
var express = require('express');
var path = require('path');
var multiparty = require('multiparty');

var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'magicCubeReal.html'));
});
app.post('/signIn', function(req, res){
	var form = new multiparty.Form();
	var str = '';
	form.parse(req, function(err, fields){
		if(fields.signInUsername[0] === 'a' && fields.signInPassword[0] === 'b'){
			str = JSON.stringify( {"name": "user name for test", "status": 'signin'} );
			res.end(str);
			return;
		} else{
			str = JSON.stringify( {"name": "", "status": ''} );
			res.end(str);
			return;
		}
	});
});
app.listen(3000);





















