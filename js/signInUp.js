//2015/8/10 start
//此文件负责玩家注册/登录
(function(){
	var signInLable = document.querySelector('.signInLable'),
		signUpLable = document.querySelector('.signUpLable'),
		signIn = document.querySelector('.signIn'),
		signUp = document.querySelector('.signUp'),
		signBox = document.getElementById('signBox'),
		close = document.querySelector('.close'),
		shade = document.querySelector('#shade'),
		stick = document.querySelector('.stick'),
		submitButtons = document.querySelectorAll('input[type = "submit"]'),
		signInForm = document.querySelector('#signInForm'),
		signUpForm = document.querySelector('#signUpForm');
	var i = 0;
	signBox.addEventListener('mouseenter', handler1, false);
	signBox.addEventListener('mouseleave', handler2, false);
	signInLable.addEventListener('click', function(){
		signIn.style.display = 'block';
		signUp.style.display = 'none';
		close.style.display = 'block';
		shade.style.display = 'block';
		this.style.borderBottom = 'none';
		signUpLable.style.borderBottom = '2px solid white';
		try{
			signBox.removeEventListener('mouseenter', handler1, false);
			signBox.removeEventListener('mouseleave', handler2, false);
		}catch(err){
			console.log(err);
		}
	}, false);
	signUpLable.addEventListener('click', function(){
		signUp.style.display = 'block';
		signIn.style.display = 'none';
		close.style.display = 'block';
		shade.style.display = 'block';
		this.style.borderBottom = 'none';
		signInLable.style.borderBottom = '2px solid white';
		try{
			signBox.removeEventListener('mouseenter', handler1, false);
			signBox.removeEventListener('mouseleave', handler2, false);
		}catch(err){
			console.log(err);
		}
	}, false);
	close.addEventListener('click', function(){
		signUp.style.display = 'none';
		signIn.style.display = 'none';
		close.style.display = 'none';
		shade.style.display = 'none';
		signUpLable.style.width = '0px';
		signInLable.style.borderBottom = 'none';
		signUpLable.style.borderBottom = 'none';
		signBox.addEventListener('mouseenter', handler1, false);
		signBox.addEventListener('mouseleave', handler2, false);
	}, false);
	function handler1(){
	//handler to show signUpLable
		signUpLable.style.width = '150px';
		stick.style.display = 'inline-block';
	};
	function handler2(){
	//handler to hide signUpLable
		signUpLable.style.width = '0px';
		stick.style.display = 'none';
	};
	for(i = 0; i < submitButtons.length; i++){
		submitButtons[i].addEventListener('mousedown', function(){
			var temp = this.style.backgroundImage;
			this.style.backgroundImage = 'none';
			this.addEventListener('mouseup', handl, false);
			function handl(){
				this.style.backgroundImage = temp;
				this.removeEventListener('mouseup', handl, false);
			}
		}, false);
	}
	signInForm.addEventListener('submit', function(event){
		event.preventDefault();
	}, false);
	signUpForm.addEventListener('submit', function(event){
		event.preventDefault();
	}, false);
}());



















