//2015/8/24 start
//本模块文件负责后台接口支持（中间件）
exports.check = function(obj){
//用于验证username,email是否被已被占用；如果username和password同时都被提供了，则用于验证登录
//参数obj是一个对象，包含着实际的有用的参数
/*例：{
*		req: req,
*		res: res,
*		db: db,
*		username: 'username',
*		email: 'email address@gmail.com',
*		password: '123456',
*		callback: func
*	}	
*/
	var req = obj.req,
		res = obj.res,
		db = obj.db,
		username = obj.username,
		email = obj.email,
		password = obj.password,
		callback = obj.callback,
		result = false;
	if(username && password){
		db.query('SELECT username FROM user WHERE username = ? AND password = ?;', [username, password], function(err, rows){
			if(err){
				throw err;
			}
			rows.length === 0
			? result = false //表示凭借此username, password不能成功登录
			: result = true; //可以登录成功
			callback(req, res, result);
		});
	}
	if(username){
		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, rows){
			if(err){
				throw err;
			}
			rows.length === 0
			? result = true //表示此用户名没有被占用
			: result = false; //表示此用户名已经被占用
			callback(req, res, result);
		});
	}
	if(email){
		db.query('SELECT email FROM user WHERE email = ?', [email], function(err, rows){
			if(err){
				throw err;
			}
			rows.length === 0
			? result = true //表示可以继续使用此邮箱注册
			: result = false; //表示此邮箱已经被占用
			callback(req, res, result);
		});
	}
};
exports.register = function(obj){
//参数obj是一个对象，包含着实际的有用的参数
/*例：{
*	req: req,
*	res: res,
*	db: db,
*	username: 'username',
*	email: 'email address@gmail.com',
*	password: '123456'
*	}
*/
	var req = obj.req,
		res = obj.res,
		db = obj.db,
		username = obj.username,
		email = obj.email,
		password = obj.password,
		callback = obj.callback,
		result = false;
	db.query('INSERT INTO user (username, email, password, registertime) VALUES (?, ?, ?, now())', [username, email, password], function(err, rows){
			if(err){
				throw err;
			} 
			rows.warningCount === 0
			? result = true
			: result = false;
			callback(req, res, result);
	});
};


























