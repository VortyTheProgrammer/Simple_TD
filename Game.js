//Game script

//canvas
	var canvas = $("canvas"),
		ctx = canvas.getContext("2d"),
		cSize = canvas.getBoundingClientRect();
//size
	var width  = canvas.width  = canvas.style.width  = cSize.right,
		height = canvas.height = canvas.style.height = cSize.bottom;
	canvas.style.position = "absolute";
	canvas.style.top = "50%";
	canvas.style.left = "50%";
	canvas.style.marginLeft = "-"+(width/2)+"px";
	canvas.style.marginTop = "-"+(height/2)+"px";
//game objects
	var map = new Grid(20, 20, 60, 25);
	var enemyes = [];
	var turrets = [];
	var bullets = [];
//mouse
	var mouseX, mouseY;
	canvas.onmousedown = function(e) { click(e.button); };
	canvas.onmouseup = function(e) { unclick(e.button); };
	canvas.onmousemove = function(e) {
        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;
    };
    canvas.oncontextmenu = function(e) { return false; };
    window.onkeyup = function(e) {
    	switch (e.keyCode) {
			case "B".charCodeAt(0): typeOfEnemy = 0; break;
			case "W".charCodeAt(0): typeOfEnemy = 1; break;

			case 187: if (typeOfTurret < 2) { typeOfTurret++; updateTurretIcon(); } break;
			case 189: if (typeOfTurret > 0) { typeOfTurret--; updateTurretIcon(); } break;
        }
        if (e.keyCode >= 49 && e.keyCode <= 57) {
        	if (e.keyCode - 48 <= map.pathNumber)
        		spawnEnemy(typeOfEnemy, map, e.keyCode - 48 - 1);
        }
    };
//other
	var BASECOLOR = hsv(340, 0.9, 0.9),
		BASECOLORDARK = hsv(340, 0.9, 0.7);
	
	var cash = 0;
//spawn gui
	var guimap = new Grid(1, 1, 1, 25);
	var typeOfEnemy = 1;
	var typeOfTurret = 1;
	var turretIcon;
//run
	setContext(ctx);
	bgFill(YELLOW);
	Start();
	Update();
//-----------------------------------------------------------------------------------------------------------
//start function
	function Start() {
	//map
		map.start();
		map.setPaths(randomN(2, 5));
	//base cash
		cash = 0;
	//spawn gui
		guimap.cSize = 1.5*map.cSize;
		guimap.drawOffsetX = 0;
		guimap.drawOffsetY = 0;
		updateTurretIcon();
	}
//update function
	function Update() {
	//base update
		for (var i = 0; i < enemyes.length; i++) {
			if (enemyes[i]) {
				enemyes[i].update();
				if (enemyes[i].isDead) { enemyes.splice(i, 1); i--; }
			}
		}
		for (var i = 0; i < turrets.length; i++) turrets[i].update(enemyes);
		for (var i = 0; i < bullets.length; i++) {
			if (bullets[i]) {
				bullets[i].update(enemyes);
				if (bullets[i].isDead) { bullets.splice(i, 1); i--; }
			}
		}
	//draw
		bgFill(gray(2));
		map.drawGrid();
		drawRadius();
		for (var i = 0; i < turrets.length; i++) turrets[i].drawBody();
		for (var i = 0; i < bullets.length; i++) bullets[i].draw();
		for (var i = 0; i < turrets.length; i++) turrets[i].drawHead();
		for (var i = 0; i < enemyes.length; i++) enemyes[i].draw();
		map.drawTarget();
	//base GUI
		//for (var i = 0; i < turrets.length; i++) turrets[i].drawReloading();
		for (var i = 0; i < enemyes.length; i++) enemyes[i].drawLife();
		map.drawTargetLife();
	//spawn icons
		if (turretIcon) { turretIcon.drawBody(); turretIcon.drawHead(); }
	//loop
		requestAnimationFrame(Update);
	}
//click functions
//-----------------------------------------------------------------------------------------------------------
	function click(_b) {
		var posx = div(mouseX - map.drawOffsetX, map.cSize),
			posy = div(mouseY - map.drawOffsetY, map.cSize);
		if (min(posx, posy) >= 0 && max(posx - map.w, posy - map.h) < 0) {
			var isTurret = false, turretInd = -1;
			for (var i = 0; i < turrets.length; i++) {
				if (posx == turrets[i].pos.x && posy == turrets[i].pos.y) {
					isTurret = true;
					turretInd = i;
					break;
				}
			}
			if (_b == 0) {
				if (!isTurret && map.array[posy][posx].block)
					spawnTurret(typeOfTurret, map, posx, posy);
			}
			if (_b == 2) {
				if (isTurret)
					turrets.splice(turretInd, 1);
			}
		}
	}
	function unclick(_b) {

	}
//-----------------------------------------------------------------------------------------------------------
//spawn functions
	function spawnEnemy(_id, _g, _p) {
		var obj;
	//create
		switch (_id) {
			case 0: obj = new Enemy(_g, _p); break;
			case 1: obj = new BaseWorm(_g, _p); break;
			default: return false; break;
		}
		obj.start();
		enemyes.push(obj);
		return true;
	}
	
	function spawnBullet(_id, _g, _p, _t) {
		var obj;
	//pos & dir
		var _x = (_p.x + 0.5)*_g.cSize,
			_y = (_p.y + 0.5)*_g.cSize,
			_d = radToDeg(polarAngle(_t.pos.x - _x, _y - _t.pos.y));
	//create
		switch (_id) {
			case 0: obj = new Bullet(_g, _x, _y, _d); break;
			case 1: obj = new BaseCannonBullet(_g, _x, _y, _d); break;
			case 2: obj = new AdvancedCannonBullet(_g, _x, _y, _d); break;
			default: return false; break;
		}
		bullets.push(obj);
		return true;
	}

	function spawnTurret(_id, _g, _x, _y) {
		var obj;
	//create
		switch (_id) {
			case 0: obj = new Turret(_g, _x, _y); break;
			case 1: obj = new BaseCannon(_g, _x, _y); break;
			case 2: obj = new AdvancedCannon(_g, _x, _y); break;
			default: return false; break;
		}
		turrets.push(obj);
		return true;
	}
//-----------------------------------------------------------------------------------------------------------
//other functions
	function findFirst(_e) {
		var ind = -1;
		for (var i = 0; i < _e.length; i++) {
			if (ind >= 0) {
				var e = _e[i], s = _e[ind],
					thisProgress = e.grid.cell*e.progress + e.offset;
					saveProgress = s.grid.cell*s.progress + s.offset;
				if (thisProgress > saveProgress)
					ind = i;
			}
			else ind = i;
		}
		if (ind >= 0)
			return _e[ind];
	}
	
	function damageTarget(_d) {
		map.target.life -= 1; //_d;
		if (map.target.life <= 0) {
		//game over
			//alert("GAME OVER");
		}
	}

	function drawRadius() {
		var posx = div(mouseX - map.drawOffsetX, map.cSize),
			posy = div(mouseY - map.drawOffsetY, map.cSize);
		for (var i = 0; i < turrets.length; i++) {
			if (posx == turrets[i].pos.x && posy == turrets[i].pos.y)
				turrets[i].drawRadius();
		}
	}

	function updateTurretIcon() {
		switch (typeOfTurret) {
			case 0: turretIcon = new Turret(guimap, 0, 0); break;
			case 1: turretIcon = new BaseCannon(guimap, 0, 0); break;
			case 2: turretIcon = new AdvancedCannon(guimap, 0, 0); break;
		}
	}
