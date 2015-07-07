//2015/7/4 start
(function(){
	var cubeParameters = {
		rank: 3, //grids of cube
		scale: 1 //scale visual size of the cube 
	};
	var buildCubeFragment = (function(){
	//建立一个rank阶魔方
		var buildSurface = (function(){
			//用于帮助设置小方块的attribute,style.transform等
			//查询出floor的轴线方向, 部署到各个平面的rotate值
			//（唉，我去，根本注释不清楚啊。希望我再看这段代码时能看明白。）
			var DB = {
				front: {
					row: 'x',
					column: 'y',
					color: 'blue',
					rotate: '',
					translateAxis: 'Z',
					translateSign: '+'
				},
				left: {
					row: 'z',
					column: 'y',
					color: 'orange',
					rotate: 'rotateY(-90deg)',
					translateAxis: 'X',
					translateSign: '-'
				},
				top: {
					row: 'x',
					column: 'z',
					color: 'yellow',
					rotate: 'rotateX(90deg)',
					translateAxis: 'Y',
					translateSign: '-'
				},
				back: {
					row: 'x',
					column: 'y',
					color: 'green',
					rotate: '',
					translateAxis: 'Z',
					translateSign: '-'
				},
				right: {
					row: 'z',
					column: 'y',
					color: 'red',
					rotate: 'rotateY(-90deg)',
					translateAxis: 'X',
					translateSign: '+'
				},
				bottom: {
					row: 'x',
					column: 'z',
					color: 'whitesmoke',
					rotate: 'rotateX(90deg)',
					translateAxis: 'Y',
					translateSign: '+'
				}
			};
			return function(face){
				var surface = document.createDocumentFragment();
				var rank = cubeParameters.rank,
					i = 0,
					center = rank / 2,
					row = DB[face].row,
					column = DB[face].column,
					color = DB[face].color,
					rotate = DB[face].rotate,
					translate = 'translate' + DB[face].translateAxis + '(' + DB[face].translateSign + rank / 2 * 110 + 'px)',
					cell;
				for(i = 0; i < rank*rank; i++){
					cell = document.createElement('div');
					cell.setAttribute('color', color);
					cell.setAttribute('surface', face);
					cell.setAttribute( 'floor', row + (i % rank + 1) + column + (Math.floor(i / rank) + 1) );
					//形成多个cell组成的一个面
					cell.style.transform = 'translate(' + (i % rank + 0.5 - center) * 100 + '%,' + (Math.floor(i / rank) + 0.5 - center) *100 + '%)';
					//把surface部署到合适的位置
					cell.style.transform = rotate + cell.style.transform;
					cell.style.transform = translate + cell.style.transform;
					surface.appendChild(cell);
				}
				return surface;
			}
		}());
		return function(){
			var rank = cubeParameters.rank;
			var cube = document.createDocumentFragment();
			cube.appendChild( buildSurface('front') );
			cube.appendChild( buildSurface('back') );
			cube.appendChild( buildSurface('left') );
			cube.appendChild( buildSurface('right') );
			cube.appendChild( buildSurface('top') );
			cube.appendChild( buildSurface('bottom') );
			return cube;
		};
	}());
	var playerRotateCubeIni = function(){
	//执行该函数，玩家将可以控制旋转整个魔方
		var cubeCon = document.getElementById('cubeContainer'),
			cube = document.getElementById('cube');
		cube.style.transform = 'scale(' + cubeParameters.scale + ') perspective(1500px) rotateX(-25deg) rotateY(-32deg) rotateZ(0deg)';
		var handlerMove;
		var handlerMoveF = function(originX, originY){
			var flag = 1,
				strSuf = '',
				strPre = '',
				strNumX = '',
				strNumY = '',
				regX = /rotateX\([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)deg\)/g,
				regY = /rotateY\([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)deg\)/g,
				transOrigin = '',
				rent,
				borrow;
			return handlerMove = function( event ){
				if(flag === 1){
					flag = 0;
					transOrigin = cube.style.transform;
					rent = regX.exec( transOrigin );
					borrow = regY.exec( transOrigin );
					strPre = transOrigin.substring( 0, Math.min(rent.index, borrow.index) );
					strSuf = transOrigin.substring( Math.max(regX.lastIndex, regY.lastIndex) );
					strNumX = rent[0].match(/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/)[0];
					strNumY = borrow[0].match(/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/)[0];
				}
				rent = (event.pageX - originX) / 4 + +strNumY;
				borrow = (originY - event.pageY) / 4 + +strNumX;
				cube.style.transform = strPre + 'rotateX(' + borrow + 'deg) ' + 'rotateY(' + rent + 'deg) ' + strSuf;
			};
		};
		var handlerUp = function(){
			cubeCon.removeEventListener('mouseup', handlerUp, false);
			cubeCon.removeEventListener('mousemove', handlerMove, false);
		};
		cubeCon.addEventListener('mousedown', function( event ){
			event.stopPropagation();
			event.preventDefault();
			cubeCon.addEventListener('mouseup', handlerUp, false);
			cubeCon.addEventListener('mousemove', handlerMoveF(event.pageX, event.pageY), false);
		}, false);
	};
	var playerScaleCubeIni = function(){
	//执行该函数，玩家将可以使用鼠标滚轮控制魔方大小
		var cubeCon = document.getElementById('cubeContainer'),
			cube = document.getElementById('cube'),
			change = 0.8,
			regexp = /scale\(([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))\)/g,
			result;
		cubeCon.addEventListener('wheel', handler, false);
		function handler(event){
			event.preventDefault();
			event.wheelDelta > 0
			? change = 1.1
			: change = 0.9;
			result = regexp.exec( cube.style.transform );
			( change = (+result[1])*change ) < 0.03 && (change = +result[1]);
			cube.style.transform =  'scale(' + change + ')' + cube.style.transform.substring( regexp.lastIndex );
			regexp.lastIndex = 0;
		};
	};
	var initializeCubeParameter = function(rank){///////////////需要改，要求自己获得rank值
		cubeParameters.rank = rank;
		cubeParameters.scale = (0.7 + Math.log10(rank)) * 2 / rank;
	};
	document.addEventListener('DOMContentLoaded', function(){
		initializeCubeParameter(6);
		document.getElementById('cube').appendChild( buildCubeFragment() );
		playerRotateCubeIni();
		playerScaleCubeIni();
	}, false);
}());