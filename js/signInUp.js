//2015/8/10 start
//此文件负责玩家注册/登录
(function(){
//此代码块主要负责交互（不和服务器打交道的交互）
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
		signBoxEle.addEventListener('mouseenter', handler1, false);
		signBoxEle.addEventListener('mouseleave', handler2, false);
	}, false);
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
			event.preventDefault();
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
		var handler1 = (function(){
		//验证username
			var reg = /^[\u4E00-\u9FA5\w]{1,30}$/;
			return function(){
				if(this.value === ''){
					return;
				}
				if(this.value.length > 30){
					remindTextEle.nodeValue = 'Username is too long (maximum is 30 characters).';
					remindEle.style.top = '-2px';
					remindEle.style.display = 'block';
					remindEle.for = 'username';
					remindEle.cause = 'tooLong';
					return;
				} else if(remindEle.cause === 'tooLong'){
					remindEle.style.display = 'none';
				}
				if( !reg.test(this.value) ){
					remindTextEle.nodeValue = 'Only alphanumeric and chinese characters and underscore are allowed.';
					remindEle.style.top = '-23px';
					remindEle.style.display = 'block';
					remindEle.for = 'username';
					remindEle.cause = 'specialChar';
					return;
				} else if(remindEle.cause === 'specialChar'){
					remindEle.style.display = 'none';
				}
				console.log('这里将进行用户名验重');//////////////////////////////////////////////////////
			};
		}());
		usernameEle.oninput = handler1;
		usernameEle.onfocus = handler1;
		usernameEle.onblur = function(){
			remindEle.for === 'username' && (remindEle.style.display = 'none');
		};
		var handler2 = (function(){
			var reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
			return function(){
				if(!reg.test(this.value)){
					remindTextEle.nodeValue = 'Invalid email address.';
					remindEle.style.top = '52px';
					remindEle.style.display = 'block';
					remindEle.for = 'email';
					remindEle.cause = 'invalid';
					return;
				} else if(remindEle.cause === 'invalid'){
					remindEle.style.display = 'none';
				}
				console.log('这里将进行email查重');
			};
		}());
		emailEle.onblur = handler2;
		emailEle.oninput = function(){
			if(remindEle.for = 'email'){
				remindEle.style.display = 'none';
			}
		};
		var handler3 = (function(){
			var reg = /^[\w~`!@#$%^&*()_\-+=\{\}\[\]\\|;:'",<.>/?]{6,30}$/;
			return function(){
				if(this.value.length < 6){
					remindTextEle.nodeValue = 'Password is too short (minimum is 6 characters).';
					remindEle.style.top = '68px';
					remindEle.style.display = 'block';
					remindEle.for = 'password';
					remindEle.cause = 'tooShort';
					return;
				}
				if(this.value.length > 30){
					remindTextEle.nodeValue = 'Password is too long (maximum is 30 characters).';
					remindEle.style.top = '68px';
					remindEle.style.display = 'block';
					remindEle.for = 'password';
					remindEle.cause = 'tooLong';
					return;
				}
				if( this.value.search(reg) === -1 ){
					remindTextEle.nodeValue = 'Only alphanumeric characters and ~`!@#$%^&*()_-+={}[]\|;:\'\",<.>/? are allowed.';
					remindEle.style.top = '68px';
					remindEle.style.display = 'block';
					remindEle.for = 'password';
					remindEle.cause = 'badChar';
					return;
				}
			};
		}());
		passwordEle.onblur = handler3;
		passwordEle.oninput = function(){
			if(remindEle.for = 'password'){
				remindEle.style.display = 'none';
			}
		};
	}());
}());

(function(){
//此代码块主要负责通过合法性验证的表单提交
//不使用form原生的submit事件
//使用自定义的验证过的submit事件
	var player = {
		status: 'signout',
		name: ''
	};
	window.player = player;
	(function(){
	//此代码块负责登录表单的提交
		var formEle = document.querySelector('#signInForm');
		formEle.addEventListener('validatedSubmit', function(event){
			var formData = new FormData(this),
				xhr = new XMLHttpRequest();
			xhr.open('POST', '/signIn');
			xhr.send(formData);
			xhr.onload = function(){
				console.log(xhr.responseText);////////////////////////////////////////////////////////////////////////////////////////
				var responseJSON = JSON.parse(xhr.responseText);
				if(responseJSON.status === 'signin'){
					player.status = 'signin';
					player.name = responseJSON.name;
				} else{
					document.querySelector('#signBox>.signIn>.warn').style.display = 'block';
				}
			};
		}, false);
	}());
	(function(){
	//此代码块负责注册表单的提交
		var formEle = document.querySelector('#signUpForm');
		formEle.addEventListener('submit', function(event){
			event.preventDefault();
			console.log('Ok, you clicked the \'submit\' button. I got it.');
		}, false);
	}());
}());



















