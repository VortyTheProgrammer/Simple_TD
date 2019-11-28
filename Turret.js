//base turret function

function Turret(_g, _x, _y) {
//grid
	this.grid = _g;
//position
	this.pos = {x: _x, y: _y};
//shoot
	this.bullet = 0;
	this.maxTime = 50;
	this.timer = 0;
	this.radius = this.grid.cSize * 3;
	this.nearestEnemyes = [];
//draw
	this.angle = 0;
//functions
	this.update = function(_e) {
		var e = findFirst(this.nearestEnemyes);
		this.timer--;
		if (this.timer <= 0) {
			this.updateNearest(_e);
			if (this.nearestEnemyes.length) {
				this.shoot(e);
				this.timer = this.maxTime;
			}
		}
		if (e) {
			this.angle = radToDeg(polarAngle(
				e.pos.x - (this.pos.x+0.5)*this.grid.cSize,
				(this.pos.y+0.5)*this.grid.cSize - e.pos.y,
			));
		}
	};
	this.updateNearest = function(_e) {
		this.nearestEnemyes = [];
		var x = (this.pos.x+0.5)*this.grid.cSize,
			y = (this.pos.y+0.5)*this.grid.cSize;
		for (var i = 0; i < _e.length; i++) {
			var d = polarRadius(_e[i].pos.x - x, _e[i].pos.y - y);
			if (d <= this.radius)
				this.nearestEnemyes.push(_e[i]);
		}
	};
	this.shoot = function(e) {
		var e = findFirst(this.nearestEnemyes);
		if (e) {
			spawnBullet(this.bullet, this.grid, this.pos, e);
		}
	};
	this.drawRadius = function() {
		var s = this.grid.cSize,
			x = this.grid.drawOffsetX + this.pos.x*s,
			y = this.grid.drawOffsetY + this.pos.y*s;
		fill(stroke(hsv(0, 0, 1, 0.04)));
		drawCircle(x + s/2, y + s/2, this.radius);
		drawCircle(x + s/2, y + s/2, this.radius, 1.5);
	};
	this.drawBody = function() {
		var s = this.grid.cSize,
			x = this.grid.drawOffsetX + this.pos.x*s,
			y = this.grid.drawOffsetY + this.pos.y*s,
			c = 0.9*s;
		fill(BASECOLOR);
		drawRect(x + c, y + c, s-2*c, s-2*c);
	};
	this.drawHead = function() {
		var s = this.grid.cSize,
			x = this.grid.drawOffsetX + (this.pos.x+0.5)*s,
			y = this.grid.drawOffsetY + (this.pos.y+0.5)*s,
			c = 0.9*s,
			l = s/4 + s/6*(1 - max(this.timer/this.maxTime, 0));
		fill(stroke(BASECOLORDARK));
		drawCircle(x, y, c/4);
		drawLine(x, y, x + l*dcos(this.angle), y - l*dsin(this.angle), c/4);
	};
	this.drawReloading = function() {
		if (this.timer > 0 && this.timer != this.maxTime) {
			var s = this.grid.cSize,
				x = this.grid.drawOffsetX + this.pos.x*s,
				y = this.grid.drawOffsetY + this.pos.y*s,
				h = s/10, l = s/12;
			fill(BLACK);
			drawRect(x, y-l-h, s, h);
			var p = this.timer / this.maxTime;
			fill(hsv(0, 0, 0.75));
			drawRect(x, y-l-h, s - s*p, h);
		}
	};
}

//-----------------------------------------------------------------------------------------------------------
//other types
function BaseCannon(_g, _x, _y) {
//inherition
	Turret.call(this, _g, _x, _y);
//parameters
	this.bullet = 1;
	this.maxTime = 65;
//functions
	this.drawBody = function() {
		var s = this.grid.cSize,
			x = this.grid.drawOffsetX + this.pos.x*s,
			y = this.grid.drawOffsetY + this.pos.y*s,
			c = 0.9*s;
	//feet
		fill(hsv(33, 1, 0.7));
		for (var j = -1; j <= 1; j += 2)
		for (var i = -1; i <= 1; i += 2)
		drawCircle(x + s/2 + i*(s/2 - c), y + s/2 + j*(s/2 - c), s-c);
	//body
		fill(hsv(33, 1, 0.86));
		drawRect(x + c, y + c, s-2*c, s-2*c);
	};
	this.drawHead = function() {
		var s = this.grid.cSize,
			x = this.grid.drawOffsetX + (this.pos.x+0.5)*s,
			y = this.grid.drawOffsetY + (this.pos.y+0.5)*s,
			c = 0.9*s,
			l = s/4 + s/6*(1 - max(this.timer/this.maxTime, 0));
	//head
		fill(stroke(hsv(33, 1, 0.7)));
		drawCircle(x, y, c/4);
		drawLine(x, y, x + l*dcos(this.angle), y - l*dsin(this.angle), c/4, 'square');
	}
}

function AdvancedCannon(_g, _x, _y) {
//inherition
	Turret.call(this, _g, _x, _y);
//parameters
	this.bullet = 2;
	this.maxTime = 50;
	this.radius = this.grid.cSize * 3.5;
//functions
	this.drawBody = function() {
		var s = this.grid.cSize,
			x = this.grid.drawOffsetX + this.pos.x*s,
			y = this.grid.drawOffsetY + this.pos.y*s,
			c = 0.9*s;
	//feet
		fill(hsv(18, 1, 0.7));
		for (var j = -1; j <= 1; j += 1)
		for (var i = -1; i <= 1; i += 1)
		drawCircle(x + s/2 + i*(s/2 - c), y + s/2 + j*(s/2 - c), s-c);
	//body
		fill(hsv(18, 1, 0.86));
		drawRect(x + c, y + c, s-2*c, s-2*c);
	};
	this.drawHead = function() {
		var s = this.grid.cSize,
			x = this.grid.drawOffsetX + (this.pos.x+0.5)*s,
			y = this.grid.drawOffsetY + (this.pos.y+0.5)*s,
			c = 0.9*s,
			l = s/4 + s/6*(1 - max(this.timer/this.maxTime, 0));
	//head
		fill(stroke(hsv(18, 1, 0.7)));
		drawCircle(x, y, c/4);
		drawLine(x, y, x + l*dcos(this.angle), y - l*dsin(this.angle), c/4, 'square');
	}
}
