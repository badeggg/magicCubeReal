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
	var submitSignInEle = document.querySelector('#signInForm>span>input[type="submit"]'),
		submitSignUpEle = document.querySelector('#signUpForm>input[type = "submit"]'),
		signInFormEle = document.querySelector('#signInForm'),
		signUpFormEle = document.querySelector('#signUpForm');
	submitSignInEle.addEventListener('click', (function(){
	//验证用户名和密码
	//不使用form原生的submit事件
	//使用自定义的验证过的submit事件
		var usernameEle = signInFormEle.querySelector('input[type = "text"]'),
			passwordEle = signInFormEle.querySelector('input[type = "password"]'),
			remindEle = signInFormEle.querySelector('.remind'),
			remindTextEle = signInFormEle.querySelector('.remind>p').firstChild;
		usernameEle.onfocus = function(){
			remindEle.for === 'username' && (remindEle.style.display = 'none');
		};
		passwordEle.onfocus = function(){
			remindEle.for === 'password' && (remindEle.style.display = 'none');
		};
		return function(event){
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
			signInFormEle.dispatchEvent( new Event('validatedSubmit') );
		};
	}()), false);
}());

(function(){
//此代码块主要负责ajax
	var signInFormEle = document.querySelector('#signInForm'),
		signUpFormEle = document.querySelector('#signUpForm');
		i = 0;
	var player = {
			status: 'signout',
			name: ''
	};
	window.player = player;
	signInFormEle.addEventListener('validatedSubmit', function(event){
	//不使用form原生的submit事件
	//使用自定义的验证过的submit事件
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
	signUpFormEle.addEventListener('submit', function(event){
		event.preventDefault();
		console.log('Ok, you clicked the \'submit\' button. I got it.');
	}, false);
}());



















