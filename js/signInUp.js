//2015/8/10 start
//此文件负责玩家注册/登录
(function(){
//此代码块主要负责交互（不和服务器打交道的交互）
	(function(){
	//负责登录之前的div交互，即 #signBox
		var signInLableEle = document.querySelector('.signInLable'),
			signUpLableEle = document.querySelector('.signUpLable'),
			signInEle = document.querySelector('.signIn'),
			signUpEle = document.querySelector('.signUp'),
			signBoxEle = document.getElementById('signBox'),
			closeEle = document.querySelector('.close'),
			shadeEle = document.querySelector('#shade'),
			stickEle = document.querySelector('.stick');
		signBoxEle.addEventListener('mouseenter', handler1, false);
		signBoxEle.addEventListener('mouseleave', handler2, false);
		function handler1(){
		//handler to show signUpLableEle
			signUpLableEle.style.width = '150px';
			stickEle.style.display = 'inline-block';
		};
		function handler2(){
		//handler to hide signUpLableEle
			signUpLableEle.style.width = '0px';
			stickEle.style.display = 'none';
		};
		signInLableEle.addEventListener('click', function(){
			signInEle.style.display = 'block';
			signUpEle.style.display = 'none';
			closeEle.style.display = 'block';
			shadeEle.style.display = 'block';
			this.style.borderBottom = 'none';
			signUpLableEle.style.borderBottom = '2px solid white';
			try{
				signBoxEle.removeEventListener('mouseenter', handler1, false);
				signBoxEle.removeEventListener('mouseleave', handler2, false);
			}catch(err){
				console.log(err);
			}
		}, false);
		signUpLableEle.addEventListener('click', function(){
			signUpEle.style.display = 'block';
			signInEle.style.display = 'none';
			closeEle.style.display = 'block';
			shadeEle.style.display = 'block';
			this.style.borderBottom = 'none';
			signInLableEle.style.borderBottom = '2px solid white';
			try{
				signBoxEle.removeEventListener('mouseenter', handler1, false);
				signBoxEle.removeEventListener('mouseleave', handler2, false);
			}catch(err){
				console.log(err);
			}
		}, false);
		closeEle.addEventListener('click', function(){
			signUpEle.style.display = 'none';
			signInEle.style.display = 'none';
			closeEle.style.display = 'none';
			shadeEle.style.display = 'none';
			signUpLableEle.style.width = '0px';
			signInLableEle.style.borderBottom = 'none';
			signUpLableEle.style.borderBottom = 'none';
			stickEle.style.display = 'none';
			signBoxEle.addEventListener('mouseenter', handler1, false);
			signBoxEle.addEventListener('mouseleave', handler2, false);
		}, false);
	}());
	(function(){
	//负责登录之后的div交互，即 #userBox
		var signBoxEle = document.getElementById('signBox'),
			userBoxEle = document.querySelector('#userBox'),
			userEle = userBoxEle.querySelector('.user'),
			stickEle = userBoxEle.querySelector('.stick'),
			signOutEle = userBoxEle.querySelector('.signOut'),
			closeEle = document.querySelector('.close');
		userBoxEle.onmouseenter = function(){
			signOutEle.style.width = '150px';
			stickEle.style.display = 'inline-block';
		};
		userBoxEle.onmouseleave = function(){
			signOutEle.style.width = '0px';
			stickEle.style.display = 'none';
		};
		signOutEle.onclick = function(){
			signBoxEle.style.display = 'block';
			userBoxEle.style.display = 'none';
			document.cookie = 'user =';
			closeEle.dispatchEvent( new Event('click') );
		};
	}());
}());

(function(){
//此代码块主要负责验证表单数据的合法性
	(function(){
	//验证登录表单的合法性
		var formEle = document.querySelector('#signInForm'),
			usernameEle = formEle.querySelector('input[type = "text"]'),
			passwordEle = formEle.querySelector('input[type = "password"]'),
			submitEle = formEle.querySelector('input[type="submit"]'),
			remindEle = formEle.querySelector('.remind'),
			remindTextEle = remindEle.querySelector('p').firstChild;
		submitEle.addEventListener('click', function(event){
			event.preventDefault();//不使用form原生的submit事件
			if(usernameEle.value === ''){
				remindTextEle.nodeValue = 'We need your username/email.';
				remindEle.style.top = '19px';
				remindEle.style.display = 'block';
				remindEle.for = 'username';
				return;
			}
			if(passwordEle.value === ''){
				remindTextEle.nodeValue = 'We need your password.';
				remindEle.style.top = '62px';
				remindEle.style.display = 'block';
				remindEle.for = 'password';
				return;
			}
			formEle.dispatchEvent( new Event('validatedSubmit') );
		}, false);
		usernameEle.onfocus = (function(){
			var remindEle = formEle.querySelector('.remind');
			return function(){
				remindEle.for === 'username' && (remindEle.style.display = 'none');
			};
		}());
		passwordEle.onfocus = (function(){
			var remindEle = formEle.querySelector('.remind');
			return function(){
				remindEle.for === 'password' && (remindEle.style.display = 'none');
			};
		}());
	}());
	
	(function(){
	//验证注册表单的合法性
		var formEle = document.querySelector('#signUpForm'),
			usernameEle = formEle.querySelector('input[name = "signUpUsername"]'),
			emailEle = formEle.querySelector('input[name = "email"]'),
			passwordEle = formEle.querySelector('input[name = "signUpPassword"]'),
			submitEle = formEle.querySelector('input[type="submit"]'),
			remindEle = formEle.querySelector('.remind'),
			remindTextEle = remindEle.querySelector('p').firstChild;
		var validate1 = (function(){
		//验证username
			var reg = /^[\u4E00-\u9FA5\w]{1,40}$/;
			return function(cascade){
			//cascade：布尔值
			//cascade === true，那么将把validate2作为callback并执行，
			//validate3作为validate2的callback并执行,
			//最后‘触发validatedSubmie事件’作为validate3的callback
				if(usernameEle.value === ''){
					remindTextEle.nodeValue = 'Username can\'t be blank.';
					remindEle.style.top = '19px';
					remindEle.style.display = 'block';
					remindEle.for = 'username';
					remindEle.cause = 'blank';
					return;
				} else if(remindEle.for === 'username' && remindEle.cause === 'blank'){
					remindEle.style.display = 'none';
				}
				if(usernameEle.value.length > 40){
					remindTextEle.nodeValue = 'Username is too long (maximum is 40 characters).';
					remindEle.style.top = '-2px';
					remindEle.style.display = 'block';
					remindEle.for = 'username';
					remindEle.cause = 'tooLong';
					return;
				} else if(remindEle.for === 'username' && remindEle.cause === 'tooLong'){
					remindEle.style.display = 'none';
				}
				if( !reg.test(usernameEle.value) ){
					remindTextEle.nodeValue = 'Only alphanumeric and chinese characters and underscore are allowed.';
					remindEle.style.top = '-23px';
					remindEle.style.display = 'block';
					remindEle.for = 'username';
					remindEle.cause = 'specialChar';
					return;
				} else if(remindEle.for === 'username' && remindEle.cause === 'specialChar'){
					remindEle.style.display = 'none';
				}
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/checkUsername');
				xhr.send( JSON.stringify( {username: usernameEle.value} ) );
				xhr.onload = function(){
					if( !JSON.parse( xhr.responseText ).result ){
						remindTextEle.nodeValue = 'Username is already taken.';
						remindEle.style.top = '19px';
						remindEle.style.display = 'block';
						remindEle.for = 'username';
						remindEle.cause = 'taken';
						return;
					} else{
						if(remindEle.for === 'username' && remindEle.cause === 'taken'){
							remindEle.style.display = 'none';
						}
						cascade && validate2(true);
					}
				};
			};
		}());
		usernameEle.oninput = (function(){
			var timer;
			return function(){
				clearTimeout(timer);
				timer = setTimeout(validate1, 500);
			};
		}());
		usernameEle.onblur = function(){
			remindEle.for === 'username' && (remindEle.style.display = 'none');
		};
		var validate2 = (function(){
		//验证email
			var reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
			return function(cascade){
			//cascade：布尔值
			//cascade === true，那么将把validate3作为validate2的callback并执行,
			//最后‘触发validatedSubmie事件’作为validate3的callback
				if(!reg.test(emailEle.value)){
					remindTextEle.nodeValue = 'Invalid email address.';
					remindEle.style.top = '52px';
					remindEle.style.display = 'block';
					remindEle.for = 'email';
					remindEle.cause = 'invalid';
					return;
				} else if(remindEle.for === 'email' && remindEle.cause === 'invalid'){
					remindEle.style.display = 'none';
				}
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/checkEmail');
				xhr.send( JSON.stringify({email: emailEle.value}) );
				xhr.onload = function(){
					if( !JSON.parse( xhr.responseText ).result ){
						remindTextEle.nodeValue = 'Email is already taken.';
						remindEle.style.top = '52px';
						remindEle.style.display = 'block';
						remindEle.for = 'email';
						remindEle.cause = 'taken';
						return;
					} else{
						if(remindEle.for === 'email' && remindEle.cause === 'taken'){
							remindEle.style.display = 'none';
						}
						cascade && validate3(true);
					}
				};
			};
		}());
		emailEle.oninput = (function(){
			var timer;
			return function(){
				clearTimeout(timer);
				timer = setTimeout(validate2, 500);
			};
		}());
		emailEle.onblur = function(){
			if(remindEle.for = 'email'){
				remindEle.style.display = 'none';
			}
		};
		var validate3 = (function(){
		//验证password
			var reg = /^[\w~`!@#$%^&*()_\-+=\{\}\[\]\\|;:'",<.>/?]{6,40}$/;
			return function(cascade){
				if(passwordEle.value.length < 6){
					remindTextEle.nodeValue = 'Password is too short (minimum is 6 characters).';
					remindEle.style.top = '68px';
					remindEle.style.display = 'block';
					remindEle.for = 'password';
					remindEle.cause = 'tooShort';
					return;
				} else if(remindEle.for === 'password' && remindEle.cause === 'tooShort'){
					remindEle.style.display = 'none';
				}
				if(passwordEle.value.length > 40){
					remindTextEle.nodeValue = 'Password is too long (maximum is 40 characters).';
					remindEle.style.top = '68px';
					remindEle.style.display = 'block';
					remindEle.for = 'password';
					remindEle.cause = 'tooLong';
					return;
				} else if(remindEle.for === 'password' && remindEle.cause === 'tooLong'){
					remindEle.style.display = 'none';
				}
				if( passwordEle.value.search(reg) === -1 ){
					remindTextEle.nodeValue = 'Only alphanumeric characters and ~`!@#$%^&*()_-+={}[]\|;:\'\",<.>/? are allowed.';
					remindEle.style.top = '68px';
					remindEle.style.display = 'block';
					remindEle.for = 'password';
					remindEle.cause = 'badChar';
					return;
				} else{
					if(remindEle.for === 'password' && remindEle.cause === 'badChar'){
						remindEle.style.display = 'none';
					}
					cascade && formEle.dispatchEvent( new Event('validatedSubmit') );
				}
			};
		}());
		passwordEle.oninput = (function(){
			var timer;
			return function(){
				clearTimeout(timer);
				timer = setTimeout(validate3, 500);
			};
		}());
		passwordEle.onblur = function(){
			if(remindEle.for = 'password'){
				remindEle.style.display = 'none';
			}
		};
		submitEle.addEventListener('click', function(event){
			event.preventDefault();//不使用form原生的submit事件
			validate1(true);//带有true参数地执行validate1将会执行一系列地执行validate2，validate3,并触发validatedSubmit事件如果表单通过系列验证的话
		}, false);
	}());
}());

(function(){
//此代码块主要负责通过合法性验证的表单的提交
//不使用form原生的submit事件
//使用自定义的验证过的submit事件
	(function(){
	//此代码块负责登录表单的提交
		var formEle = document.querySelector('#signInForm'),
			usernameEle = formEle.querySelector('[type = "text"]'),
			passwordEle = formEle.querySelector('[type = "password"]'),
			signBoxEle = document.getElementById('signBox'),
			userBoxEle = document.getElementById('userBox'),
			shadeEle = document.getElementById('shade'),
			userEle = userBoxEle.querySelector('.user');
		formEle.addEventListener('validatedSubmit', function(event){
			var formData = new FormData(this),
				xhr = new XMLHttpRequest();
			usernameEle.value = '';
			passwordEle.value = '';
			xhr.open('POST', '/signIn');
			xhr.send(formData);
			xhr.onload = function(){
				var responseJSON = JSON.parse(xhr.responseText);
				if(responseJSON.result){
					signBoxEle.style.display = 'none';
					userBoxEle.style.display = 'block';
					shadeEle.style.display = 'none';
					userEle.firstChild.nodeValue = responseJSON.username;
					document.cookie = 'user = ' + responseJSON.username + '; max-age = ' + 60*60*24*60;
				} else{
					document.querySelector('#signBox>.signIn>.warn').style.display = 'block';
				}
			};
		}, false);
	}());
	(function(){
	//此代码块负责注册表单的提交
		var formEle = document.querySelector('#signUpForm'),
			usernameEle = formEle.querySelector('input[name = "signUpUsername"]'),
			emailEle = formEle.querySelector('input[name = "email"]'),
			passwordEle = formEle.querySelector('input[name = "signUpPassword"]'),
			signBoxEle = document.getElementById('signBox'),
			userBoxEle = document.getElementById('userBox'),
			shadeEle = document.getElementById('shade'),
			userEle = userBoxEle.querySelector('.user');
		formEle.addEventListener('validatedSubmit', function(event){
			var formData = new FormData(this),
				xhr = new XMLHttpRequest();
			usernameEle.value = '';
			emailEle.value = '';
			passwordEle.value = '';
			xhr.open('POST', '/signUp');
			xhr.send(formData);
			xhr.onload = function(){
				var responseJSON = JSON.parse(xhr.responseText);
				if(responseJSON.result){
					signBoxEle.style.display = 'none';
					userBoxEle.style.display = 'block';
					shadeEle.style.display = 'none';
					userEle.firstChild.nodeValue = responseJSON.username;
					document.cookie = 'user = ' + responseJSON.username + '; max-age = ' + 60*60*24*60;
				} else{
					document.querySelector('#signBox>.signUp>.warn').style.display = 'block';
				}
			};
		}, false);
	}());
}());
(function(){
//负责自动登录
	document.addEventListener('DOMContentLoaded', function(){
		var user = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1").trim();
			signBoxEle = document.getElementById('signBox'),
			userBoxEle = document.getElementById('userBox'),
			shadeEle = document.getElementById('shade'),
			userEle = userBoxEle.querySelector('.user');
		if(user){
			signBoxEle.style.display = 'none';
			userBoxEle.style.display = 'block';
			shadeEle.style.display = 'none';
			userEle.firstChild.nodeValue = user;
		}
	}, false);
}());
console.log('zhaoxuxujc@163.com');
console.log('I am a front end engineer, and I am looking for a job.');


















