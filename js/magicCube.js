//2015/7/4 start
(function(){
	var cubeParameters = {
		rank: 3, //grids of cube
		scale: 1 //scale visual size of the cube 
	};
	var database = {
	//'数据库'存储着魔方信息
		buildSurfaces: {
		//"数据库"。存储着构建surfaces需要的信息
		//用于帮助设置小方块的floor/color attribute, style.transform等
		//查询出floor的轴线方向, 部署到各个平面的rotate值
			front: {
				row: 'X',
				column: 'Y',
				color: 'blue',
				rotate: '',
				translateAxis: 'Z',
				translateSign: '+'
			},
			left: {
				row: 'Z',//例子：查询row,colum可知在left面，主坐标轴是Z，副坐标轴是Y（对应常见坐标系里的 X, Y）
				column: 'Y',
				color: 'orange',
				rotate: 'rotateY(-90deg)',//例子：查询rotate,translateAxis,translateSign信息可知，在left面上的cells需要rotateY(-90deg) & translateX(-(110*rank/2)px)
				translateAxis: 'X',
				translateSign: '-'
			},
			top: {
				row: 'X',
				column: 'Z',
				color: 'yellow',
				rotate: 'rotateX(90deg)',
				translateAxis: 'Y',
				translateSign: '-'
			},
			back: {
				row: 'X',
				column: 'Y',
				color: 'green',
				rotate: '',
				translateAxis: 'Z',
				translateSign: '-'
			},
			right: {
				row: 'Z',
				column: 'Y',
				color: 'red',
				rotate: 'rotateY(-90deg)',
				translateAxis: 'X',
				translateSign: '+'
			},
			bottom: {
				row: 'X',
				column: 'Z',
				color: 'whitesmoke',
				rotate: 'rotateX(90deg)',
				translateAxis: 'Y',
				translateSign: '+'
			}
		},
		buildButtons: {
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
				rowStart: '+Y',
				rowEnd: '-Y'
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
		},
		updateAttributeOfCells: {
		//“数据库”存储着更新cells的attribute(surface, floor)所需要的信息
			'+X': {
				'top': {
					next: 'back',//例子：查询此条信息可知，绕X轴正向旋转90度，top surface 将变成back surface
					axisFrom: 'Z',//标明Z轴方向上的floor将变成Y轴方向上的floor，且层数调换。如：floor 'X1Z2'变为'X1Y0'(3阶魔方)
					axisTo: 'Y',
					axisReverse: true
				},
				'back': {
					next: 'bottom',
					axisFrom: 'Y',
					axisTo: 'Z',
					axisReverse: false
				},
				'bottom': {
					next: 'front',
					axisFrom: 'Z',
					axisTo: 'Y',
					axisReverse: true
				},
				'front': {
					next: 'top',
					axisFrom: 'Y',
					axisTo: 'Z',
					axisReverse: false
				}
			},
			'-X': {
				'back': {
					next: 'top',
					axisFrom: 'Y',
					axisTo: 'Z',
					axisReverse: true
				},
				'bottom': {
					next: 'back',
					axisFrom: 'Z',
					axisTo: 'Y',
					axisReverse: false
				},
				'front': {
					next: 'bottom',
					axisFrom: 'Y',
					axisTo: 'Z',
					axisReverse: true
				},
				'top': {
					next: 'front',
					axisFrom: 'Z',
					axisTo: 'Y',
					axisReverse: false
				}
			},
			'+Y': {
				'front': {
					next: 'right',
					axisFrom: 'X',
					axisTo: 'Z',
					axisReverse: true
				},
				'right': {
					next: 'back',
					axisFrom: 'Z',
					axisTo: 'X',
					axisReverse: false
				},
				'back': {
					next: 'left',
					axisFrom: 'X',
					axisTo: 'Z',
					axisReverse: true
				},
				'left': {
					next: 'front',
					axisFrom: 'Z',
					axisTo: 'X',
					axisReverse: false
				}
			},
			'-Y': {
				'right': {
					next: 'front',
					axisFrom: 'Z',
					axisTo: 'X',
					axisReverse: true
				},
				'back': {
					next: 'right',
					axisFrom: 'X',
					axisTo: 'Z',
					axisReverse: false
				},
				'left': {
					next: 'back',
					axisFrom: 'Z',
					axisTo: 'X',
					axisReverse: true
				},
				'front': {
					next: 'left',
					axisFrom: 'X',
					axisTo: 'Z',
					axisReverse: false
				}
			},
			'+Z': {
				'top': {
					next: 'right',
					axisFrom: 'X',
					axisTo: 'Y',
					axisReverse: false
				},
				'right': {
					next: 'bottom',
					axisFrom: 'Y',
					axisTo: 'X',
					axisReverse: true
				},
				'bottom': {
					next: 'left',
					axisFrom: 'X',
					axisTo: 'Y',
					axisReverse: false
				},
				'left': {
					next: 'top',
					axisFrom: 'Y',
					axisTo: 'X',
					axisReverse: true
				}
			},
			'-Z': {
				'right': {
					next: 'top',
					axisFrom: 'Y',
					axisTo: 'X',
					axisReverse: false
				},
				'bottom': {
					next: 'right',
					axisFrom: 'X',
					axisTo: 'Y',
					axisReverse: true
				},
				'left': {
					next: 'bottom',
					axisFrom: 'Y',
					axisTo: 'X',
					axisReverse: false
				},
				'top': {
					next: 'left',
					axisFrom: 'X',
					axisTo: 'Y',
					axisReverse: true
				}
			}
		}
	};
	var buildCubeFragment = (function(){
	//建立一个rank阶魔方
		var buildSurfaces = (function(){
			var db = database.buildSurfaces;
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
					cell.setAttribute( 'floor', row + (i % rank) + ' ' + column + (Math.floor(i / rank)) + ' ' );
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
			var db = database.buildButtons;
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
					rotate = database.buildSurfaces[face].rotate,
					translate = 'translate' + database.buildSurfaces[face].translateAxis + '(' + database.buildSurfaces[face].translateSign + rank / 2 * 111.5 + 'px)';
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
							controlFloors = controlRotate[1] + j + ' ' + controlRotate[1] + (j + 1);
							buildSingleButton();
						}
					}
					if(i !== rank - 1){						
						j = 0;
						controlRotate = db[face]['rowStart'];
						controlFloors = controlRotate[1] + i + ' ' + controlRotate[1] + (i + 1);
						buttonClass = 'smallLeft';
						buildSingleButton();
						j = rank - 1;
						controlRotate = db[face]['rowEnd'];
						controlFloors = controlRotate[1] + i + ' ' + controlRotate[1] + (i + 1);
						buttonClass = 'smallRight';
						buildSingleButton();
					}
				}
				//构建一次旋转三层的buttons
				if(rank === 3){
					return buttons;
				}
				for(i = 1; i < rank - 1; i++){
					if(i === 1 || i === rank - 2){
						i === 1
						? (
							controlRotate = db[face]['columnStart'],
							buttonClass = 'bigTop'
						)
						: (
							controlRotate = db[face]['columnEnd'],
							buttonClass = 'bigBottom'
						);						
						for(j = 1; j < rank - 1; j++){
							controlFloors = controlRotate[1] + (j - 1) + ' ' + controlRotate[1] + j + ' ' + controlRotate[1] + (j + 1);
							buildSingleButton();
						}
					}
					j = 1;
					controlRotate = db[face]['rowStart'];
					controlFloors = controlRotate[1] + (i - 1) + ' ' + controlRotate[1] + i + ' ' + controlRotate[1] + (i + 1);
					buttonClass = 'bigLeft';
					buildSingleButton();
					j = rank - 2;
					controlRotate = db[face]['rowEnd'];
					controlFloors = controlRotate[1] + (i - 1) + ' ' + controlRotate[1] + i + ' ' + controlRotate[1] + (i + 1);
					buttonClass = 'bigRight';
					buildSingleButton();
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
		var buildMasks = function(){
			var masks = document.createDocumentFragment(),
				mask = document.createElement('div'),
				i = 0;
			mask.setAttribute('mask', '');
			mask.style.display = 'none';
			mask.style.backgroundColor = 'white';
			mask.style.height = mask.style.width = cubeParameters.rank * 110 + 'px';
			mask.style.borderRadius = '3px';
			mask.style.position = 'absolute';
			mask.style.left = mask.style.top = '50%';
			mask.style.transformOrigin = '0 0';
			mask.style.transform = 'translate(-50%, -50%)';
			for(i = 0; i < 4; i++){
				masks.appendChild( mask.cloneNode(true) );
			}
			return masks;
		};
		return function(){
			var cube = document.createDocumentFragment();
			cube.appendChild( buildSurfaces() );
			if(cubeParameters.rank === 1)
				return cube;
			cube.appendChild( buildButtons() );
			cube.appendChild( buildMasks() );
			return cube;
		};
	}());
	var playerRotateCubeIni = function(){
	//执行该函数，玩家将可以控制旋转整个魔方
		var cubeCon = document.getElementById('cubeContainer'),
			cube = document.getElementById('cube');
		cube.style.transform = 'scale(' + cubeParameters.scale + ') perspective(' + cubeParameters.perspective + ') rotateX(-25deg) rotateY(-32deg) rotateZ(0deg)';
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
	var initializeCubeParameter = function(rank){
		cubeParameters.rank = rank;
		cubeParameters.scale = (0.7 + Math.log10(rank)) * 2 / rank;
		cubeParameters.perspective = rank * 500 + 'px';
	};
	var playInitialize = function(){
	//执行此函数，玩家将可以玩儿
		var buttons = document.querySelectorAll('#cube>[buttonClass]'),
			i = 0;
		for(i = 0; i < buttons.length; i++){
			buttons[i].addEventListener('click', handler, false);
		}
		function selectCells(floors){
		//floors字符串。例：'X0 X1'将要被旋转的层
		//选择将要被旋转的surfaceCells & floorsCells
			var face = '',
				axis = floors[0],
				rank = cubeParameters.rank,
				i = 0;
			var surface_floorsCells = {
					surfaceCells: [],
					floorsCells: []
			};
			floors = floors.split(' ');
			if(floors[0].slice(1) === '0'){
				switch(axis){
					case 'X':
						face = 'left';
						break;
					case 'Y':
						face = 'top';
						break;
					case 'Z':
						face = 'back';
						break;
				}
			}else if(floors[floors.length - 1].slice(1) === rank - 1 + ''){
				switch(axis){
					case 'X':
						face = 'right';
						break;
					case 'Y':
						face = 'bottom';
						break;
					case 'Z':
						face = 'front';
						break;
				}
			}
			if(face){
				surface_floorsCells.surfaceCells = [].slice.apply( document.querySelectorAll('#cube>[surface = ' + face + ']') );
			}
			for(i = 0; i < floors.length; i++){
				surface_floorsCells.floorsCells =  surface_floorsCells.floorsCells.concat( [].slice.apply( document.querySelectorAll('#cube>[floor *= \"' + floors[i] + ' \"]') ) );
			}
			return surface_floorsCells;
		}
		var rotateCells = (function(){
			var rotateOne = (function(){
			//rotateOne(clockwise, axis, elem)
			//仅旋转一个元素，并没有更新此元素的相关attribute
				var duration = 400,
					steps = Math.floor( duration / 10 ),
					stepTime = duration / steps,
					stepPercent = 1 / steps;
				var yFromXCubicBezier = function( xTarget ){
					var tolerance = 0.00001,
						t0 = 0.6,
						x = 3*(1-t0)*(1-t0)*t0*0.5 + 3*(1-t0)*t0*t0*0.5 + t0*t0*t0,
						t;
					while( Math.abs(x - xTarget) > tolerance ){
						t = t0 - ( 3*(1-t0)*(1-t0)*t0*0.5 + 3*(1-t0)*t0*t0*0.5 + t0*t0*t0 - xTarget ) / ( 3*(1 - t0)*(1 - t0)*0.5 + 6*(1 - t0)*t0*(0.5 - 0.5) + 3*t0*t0*(1 - 0.5) );
						t0 = t;
						x = 3*(1-t0)*(1-t0)*t0*0.5 + 3*(1-t0)*t0*t0*0.5 + t0*t0*t0;
					}
					return 3*(1-t)*t*t*1 + t*t*t;	
				};
				return function(clockwise, axis, elem, callback){
					var rent = elem.style,
						rotatePreStr = 'rotate' + axis + '(',
						rotateOrigin,
						styleStrSuf,
						t = 0;
					rent.transform[6] === axis 
						? (
							rotateOrigin = +rent.transform.match(/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/)[0],
							styleStrSuf = 'deg)' + rent.transform.substring( rent.transform.search(' ') )
						)
						: (
							rotateOrigin = 0,
							styleStrSuf = 'deg) ' + rent.transform
						);
					t += stepPercent;
					var tick;
					if(clockwise === '-'){
						tick = setInterval(function(){
							t += stepPercent;
							rent.transform = rotatePreStr + ( -yFromXCubicBezier(t)*90 + rotateOrigin ) + styleStrSuf;
							t > 1 && (rent.transform = rotatePreStr + ( -90 + rotateOrigin ) + styleStrSuf) && ((callback && callback()) || clearInterval(tick));
						}, stepTime);
					} else{
						tick = setInterval(function(){
							t += stepPercent;
							rent.transform = rotatePreStr + ( yFromXCubicBezier(t)*90 + rotateOrigin ) + styleStrSuf;
							t > 1 && (rent.transform = rotatePreStr + ( 90 + rotateOrigin ) + styleStrSuf) && ((callback && callback()) || clearInterval(tick));
						}, stepTime);
					}
				};
			}());
			var updateAttributeOfCells = (function(){
				var rank = cubeParameters.rank,
					rotateOrigin = (rank - 1) / 2,//这里的rotateOrigin是指旋转的坐标原点
					pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source,
					regexpXZYPnum = new RegExp('([XZY])(' + pnum + ')', 'gi'),
					db = database.updateAttributeOfCells;
				return function(rotate, surfaceCells, floorsCells){
				//rotate,字符串。标明旋转轴和旋转方向。例如：'+X'
				//surfaceCells floorsCells，数组或类数组。将要更新attribute的surfaceCells & floorsCells
					var surfaceCellsAttrFloor = '',
						floorsCellsAttrFloor = '',
						floorsCellsAttrSurface = '',
						i = 0,
						j = 0,
						a = 0,//a/b,aAxis/bAxis用于更新surfaceCells的attribute(floor)
						b = 0,
						aAxis = '',
						bAxis = '',
						from = 'X',
						to = 'X',
						regexp,
						rent;
					//更新surfaceCells的attribute(floor)
					for(i = 0; i < surfaceCells.length; i++){
						surfaceCellsAttrFloor = surfaceCells[i].getAttribute('floor');
						rent = regexpXZYPnum.exec( surfaceCellsAttrFloor );
						aAxis = rent[1];
						a = +rent[2];
						rent = regexpXZYPnum.exec( surfaceCellsAttrFloor );
						bAxis = rent[1];
						b = +rent[2];
						regexpXZYPnum.lastIndex = 0;
						if(aAxis !== 'X' && bAxis !== 'Y'){
							rent = aAxis;
							aAxis = bAxis;
							bAxis = rent;
							a = a - b;
							b = a + b;
							a = b - a;
						}
						a = a - rotateOrigin;
						b = b - rotateOrigin;
						a = a - b;
						b = a + b;
						a = b - a;
						rotate[0] === '-'
						? rotate[1] !== 'Z' ? a = -a : b = -b
						: rotate[1] !== 'Z' ? b = -b : a = -a;
						a = a + rotateOrigin;
						b = b + rotateOrigin;
						surfaceCellsAttrFloor = aAxis + a + ' ' + bAxis + b + ' ';
						surfaceCells[i].setAttribute('floor', surfaceCellsAttrFloor );
					}
					//更新floorsCells的attribute(floor & surface)
					for(i = 0; i < floorsCells.length; i++){
						floorsCellsAttrSurface = floorsCells[i].getAttribute('surface');
						floorsCells[i].setAttribute('surface', db[rotate][floorsCellsAttrSurface].next);
						floorsCellsAttrFloor = floorsCells[i].getAttribute('floor');
						from = db[rotate][floorsCellsAttrSurface].axisFrom;
						to = db[rotate][floorsCellsAttrSurface].axisTo;
						if( db[rotate][floorsCellsAttrSurface].axisReverse ){
							regexp = new RegExp(from + '(' + pnum + ')', 'i');
							rent = regexp.exec( floorsCellsAttrFloor )[1];
							rent = rank - 1 - rent;
							floorsCells[i].setAttribute('floor', floorsCellsAttrFloor.replace(regexp, to + rent));
						} else{
							floorsCells[i].setAttribute('floor', floorsCellsAttrFloor.replace(from, to));
						}
						//console.log(floorsCells[i].getAttribute('floor'));
					}
				};
			}());
			var preventGoof = function(clockwise, axis, floors){
			//floors字符串。例：'X0 X1'将要被旋转的层
				var masks = document.querySelectorAll('#cube>[mask]');
				var rank = cubeParameters.rank,
					center = rank / 2,
					cut = [],//需要添加遮罩以防止被‘看穿’的位置，例如cut值为[2, 3]，那么需要在X轴（假设绕X轴旋转）floor2两侧添加mask
					i = 0,
					face,
					needIni = [],
					db = database.buildSurfaces;//这里借用一下buildSurfaces'数据库'
				switch(axis){
					case 'X':
						face = 'left';
						break;
					case 'Y':
						face = 'top';
						break;
					case 'Z':
						face = 'back';
						break;
				}
				floors = floors.split(' ');
				cut.push( floors[0].slice(1) );
				cut.push( +floors[floors.length - 1].slice(1) + 1 + '');
				//此循环最多只执行两次，逻辑却复杂晦涩。真是失败的设计
				for(i = 0; i < cut.length; i++){
					if(+cut[i] === 0 || +cut[i] === rank){
						continue;
					}
					masks[i * 2].style.transform = db[face].rotate + masks[i * 2].style.transform;
					masks[i * 2].style.transform = 'translate' + axis  + '(' + ((cut[i] - center) * 110 - 1) + 'px)' + masks[i * 2].style.transform;
					masks[i * 2].style.display = 'block';
					masks[i * 2 + 1].style.transform = db[face].rotate + masks[i * 2 + 1].style.transform;
					masks[i * 2 + 1].style.transform = 'translate' + axis  + '(' + ((cut[i] - center) * 110 + 1) + 'px)' + masks[i * 2 + 1].style.transform;
					masks[i * 2 + 1].style.display = 'block';
					needIni.push(i * 2);
					needIni.push(i * 2 + 1);
					if(i === 0){
						 +cut[1] === rank
						 ? rotateOne(clockwise, axis, masks[i * 2 + 1], initialMasks)
						 : rotateOne(clockwise, axis, masks[i * 2 + 1]);
					} else{
						rotateOne(clockwise, axis, masks[i * 2], initialMasks);
					}
				}
				function initialMasks(){
					var i = 0;
					for(i = 0; i < needIni.length; i++){
						masks[ needIni[i] ].style.display = 'none';
						masks[ needIni[i] ].style.transform = 'translate(-50%, -50%)';
					}
				}
			};
			return function(rotate, floors, surfaceCells, floorsCells){
			//rotate,字符串。标明旋转轴和旋转方向。例如：'+X'
			//floors字符串。例：'X0 X1'将要被旋转的层
			//surfaceCells, floorsCells.数组或类数组。将要被旋转的surfaceCells & floorsCells
				var clockwise = rotate[0],
					axis = rotate[1],
					i = 0;
				for(i = 0; i < surfaceCells.length; i++){
					rotateOne(clockwise, axis, surfaceCells[i]);
				}
				for(i = 0; i < floorsCells.length; i++){
					rotateOne(clockwise, axis, floorsCells[i]);
				}
				updateAttributeOfCells(rotate, surfaceCells, floorsCells);
				preventGoof(clockwise, axis, floors);
			};
		}());
		function handler(event){
			var cells = {};
			cells = selectCells( this.getAttribute('controlFloors') );
			rotateCells(this.getAttribute('controlRotate'), this.getAttribute('controlFloors'), cells.surfaceCells, cells.floorsCells);
		}
	};
	function initializeAllThings(rank){
		initializeCubeParameter(rank);
		var oldCube = document.getElementById('cube');
		var newCube = document.createElement('div');
		newCube.id = 'cube';
		newCube.appendChild( buildCubeFragment() );
		oldCube.parentNode.replaceChild(newCube, oldCube);
		playerRotateCubeIni();//playerRotateCubeIni()和playerScaleCubeIni()执行顺序不能颠倒，如果有必要，请修改内部实现
		playerScaleCubeIni();
		if(rank === 1)
			return;
		playInitialize();
	};
	window.cube = {};
	window.cube.initialize = initializeAllThings;
	window.cube.parameters = cubeParameters;
}());
/********************************************分割线，以上是魔方核心代码，以下是其他***********************************************/
(function(){
//玩家点击页面中'上'/'下'时，增加/减少魔方阶数。（仅更改数值，并不负责重新设置魔方）
	var rankSource = document.querySelector('#setRank>.set>:nth-child(2)'),
		up = document.querySelector('#setRank>.set>:first-child'),
		down = document.querySelector('#setRank>.set>:last-child'),
		reject = document.querySelector('#setRank>.rejectText'),
		enter = document.querySelector('#setRank>.enterCon>.enter');
	up.addEventListener('click', function(){
		var num = +rankSource.textContent + 1 + '';
		num.length < 3 && (rankSource.textContent = num);
		rankSource.dispatchEvent(new Event('input'));
	}, false);
	down.addEventListener('click', function(){
		var num = +rankSource.textContent - 1 + '';
		num.length < 3 && (rankSource.textContent = num);
		rankSource.dispatchEvent(new Event('input'));
	}, false);
	down.addEventListener('mouseenter', function(){
		rankSource.style.borderBottom = '2px solid rgba(0,0,0,0)';
	}, false);
	down.addEventListener('mouseleave', function(){
		rankSource.style.borderBottom = '2px solid';
	}, false);
	rankSource.addEventListener('keydown', function(event){
		if(event.keyCode >= 48 && event.keyCode <= 57 && (this.textContent.length < 2 || rankSource.selectStatus) || event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39){
			return;
		}
		event.preventDefault();
	}, false);
	rankSource.addEventListener('input', function(){
		(+rankSource.textContent > 10 || +rankSource.textContent < 1)
		? showReject()
		: cancelReject();
	}, false);
	enter.addEventListener('mousedown', function(){
		enter.style.backgroundPosition = '4px -155px';
	}, false);
	enter.addEventListener('mouseup', function(){
		enter.style.backgroundPosition = '3px -156px';
	}, false);
	enter.addEventListener('click', function(){
		cube.initialize( +rankSource.textContent );
	}, false);
	document.addEventListener('DOMContentLoaded', function(){
		cube.initialize( +rankSource.textContent );
	}, false);
	function showReject(){
		enter.style.display !== 'none' && (enter.style.display = 'none');
		reject.style.transition !== '1.5s opacity' && (reject.style.transition = '1.5s opacity');
		reject.style.opacity !== '0.7' && (reject.style.opacity = '0.7');
	}
	function cancelReject(){
		enter.style.display !== 'block' && (enter.style.display = 'block');
		reject.style.transition !== '' && (reject.style.transition = '');
		reject.style.opacity !== '0' && (reject.style.opacity = '0');
	}
}());