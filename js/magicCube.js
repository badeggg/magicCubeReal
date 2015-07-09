//2015/7/4 start
(function(){
	var cubeParameters = {
		rank: 3, //grids of cube
		scale: 1 //scale visual size of the cube 
	};
	var buildCubeFragment = (function(){
	//建立一个rank阶魔方
		var shareInformation = {};//用于共享信息
		var buildSurfaces = (function(){
			var db = {
			//"数据库"。存储着构建surfaces需要的信息
			//用于帮助设置小方块的attribute,style.transform等
			//查询出floor的轴线方向, 部署到各个平面的rotate值
			//（唉，我去，根本注释不清楚啊。希望我再看这段代码时能看明白。）
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
			shareInformation.buildSurfacesDB = db
			function buildOne(face){
				var surface = document.createDocumentFragment();
				var rank = cubeParameters.rank,
					i = 0,
					center = rank / 2,
					row = db[face].row,
					column = db[face].column,
					color = db[face].color,
					rotate = db[face].rotate,
					translate = 'translate' + db[face].translateAxis + '(' + db[face].translateSign + rank / 2 * 110 + 'px)',
					cell;
				//这个for循环有点费力气。应该用两个for循环解决问题的
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
			return function(){
				var surfaces = document.createDocumentFragment();
				surfaces.appendChild( buildOne('front') );
				surfaces.appendChild( buildOne('back') );
				surfaces.appendChild( buildOne('left') );
				surfaces.appendChild( buildOne('right') );
				surfaces.appendChild( buildOne('top') );
				surfaces.appendChild( buildOne('bottom') );
				return surfaces;
			};
		}());
		var buildButtons = (function(){
			var db = {
			//"数据库"。存储着构建buttons需要的信息（控制旋转信息）
				front: {
					columnStart: '+X',//例,查询此条信息可知在front面的最上面的一排按钮的控制行为是：绕x轴正向旋转90度
					columnEnd: '-X',
					rowStart: '-Y',
					rowEnd: '+Y'
				},
				left: {
					columnStart: '+Z',
					columnEnd: '-Z',
					rowStart: '-Y',
					rowEnd: '+Y'
				},
				top: {
					columnStart: '+X',
					columnEnd: '-X',
					rowStart: '-Z',
					rowEnd: '+Z'
				},
				back: {
					columnStart: '-X',
					columnEnd: '+X',
					rowStart: '-Y',
					rowEnd: '+Y'
				},
				right: {
					columnStart: '-Z',
					columnEnd: '+Z',
					rowStart: '+Y',
					rowEnd: '-Y'
				},
				bottom: {
					columnStart: '-X',
					columnEnd: '+X',
					rowStart: '+Z',
					rowEnd: '-Z'
				}
			};
			function buildOne(face){
			//执行此函数将建立指定surface上的buttons
				var rank = cubeParameters.rank;
				if(rank <= 1){
					return;
				}
				var buttons = document.createDocumentFragment(),
					center = rank / 2,
					but,
					i = 0,
					j = 0,
					controlRotate = '',
					controlFloors = '',
					className = '',
					rotate = shareInformation.buildSurfacesDB[face].rotate,
					translate = 'translate' + shareInformation.buildSurfacesDB[face].translateAxis + '(' + shareInformation.buildSurfacesDB[face].translateSign + rank / 2 * 111.5 + 'px)';
				function buildSingleButton(){
				//仅作为buildOne()的内部函数，不需要参数，使用buildOne()中的变量.共有程序段的集中
					but = document.createElement('div');
					but.setAttribute('controlRotate', controlRotate);//此attribute表明button控制旋转的轴和旋转方向
					but.setAttribute('controlFloors', controlFloors);//此attribute表明button控制的应该旋转的floor(s)
					but.setAttribute('buttonClass', buttonClass);//此attribute将buttons分类，从而可以使用css对他们进行样式控制
					//把button部署到二维平面里合适的位置
					but.style.transform = 'translate(' + (j + 0.5 - center) * 110 + 'px,' + (i + 0.5 - center) *110 + 'px)';
					//把button部署到三维平面里合适的位置
					but.style.transform = rotate + but.style.transform;
					but.style.transform = translate + but.style.transform;
					buttons.appendChild(but);
				}
				//构建控制一层旋转的buttons
				for(i = 0; i < rank; i++){
					//创建上、下的buttons
					if(i === 0 || i === rank - 1){
						i === 0
						? (
							controlRotate = db[face]['columnStart'],
							buttonClass = 'bigTop'
						)
						: (
							controlRotate = db[face]['columnEnd'],
							buttonClass = 'bigBottom'
						);						
						for(j = 0; j < rank; j++){
							controlFloors = controlRotate[1] + j;
							buildSingleButton();
						}
					} 
					//创建左、右buttons					
					j = 0;
					controlRotate = db[face]['rowStart'];
					controlFloors = controlRotate[1] + i;
					buttonClass = 'bigLeft';
					buildSingleButton();
					j = rank - 1;
					controlRotate = db[face]['rowEnd'];
					controlFloors = controlRotate[1] + i;
					buttonClass = 'bigRight';
					buildSingleButton();
				}
				//构建一次旋转两层的buttons
				if(rank === 2){
					return buttons;
				}
				for(i = 0; i < rank; i++){
					if(i === 0 || i === rank - 1){
						i === 0
						? (
							controlRotate = db[face]['columnStart'],
							buttonClass = 'smallTop'
						)
						: (
							controlRotate = db[face]['columnEnd'],
							buttonClass = 'smallBottom'
						);
						for(j = 0; j < rank - 1; j++){
							controlFloors = controlRotate[1] + j + controlRotate[1] + (j + 1);
							buildSingleButton();
						}
					}
					if(i !== rank - 1){						
						j = 0;
						controlRotate = db[face]['rowStart'];
						controlFloors = controlRotate[1] + i + controlRotate[1] + (i + 1);
						buttonClass = 'smallLeft';
						buildSingleButton();
						j = rank - 1;
						controlRotate = db[face]['rowEnd'];
						controlFloors = controlRotate[1] + i + controlRotate[1] + (i + 1);
						buttonClass = 'smallRight';
						buildSingleButton();
					}
				}
				return buttons;
			}
			return function(){
				var buttons = document.createDocumentFragment();
				buttons.appendChild( buildOne('front') );
				buttons.appendChild( buildOne('back') );
				buttons.appendChild( buildOne('left') );
				buttons.appendChild( buildOne('right') );
				buttons.appendChild( buildOne('top') );
				buttons.appendChild( buildOne('bottom') );
				return buttons;
			};
		}());
		return function(){
			var cube = document.createDocumentFragment();
			cube.appendChild( buildSurfaces() );
			cube.appendChild( buildButtons() );
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
		initializeCubeParameter(3);
		document.getElementById('cube').appendChild( buildCubeFragment() );
		playerRotateCubeIni();
		playerScaleCubeIni();
	}, false);
}());