//2015/8/10 start
//此文件负责玩家注册/登录
(function(){
	var signInLable = document.querySelector('.signInLable'),
		signUpLable = document.querySelector('.signUpLable'),
		signIn = document.querySelector('.signIn'),
		signUp = document.querySelector('.signUp');
	signInLable.addEventListener('click', function(){
		signIn.style.display = 'block';
		signUp.style.display = 'none';
	}, false);
	signUpLable.addEventListener('click', function(){
		signUp.style.display = 'block';
		signIn.style.display = 'none';
	}, false);
}());



















