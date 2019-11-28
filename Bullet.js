//base bullet function

function Bullet(_g, _x, _y, _d) {
//grid
	this.grid = _g;
//move
	this.pos = {x: _x, y: _y};
	this.dir = _d;
	this.spd = 7;
//collision
	this.damage = 1;
	this.isDead = false;
//draw
	this.prevPos = {x: this.pos.x, y: this.pos.y};
	this.color = BASECOLORDARK;
//functions
	this.update = function(_e) {
		if (!this.isDead) {
		//move
			this.prevPos.x = this.pos.x;
			this.prevPos.y = this.pos.y;
			this.pos.x += this.spd * dcos(this.dir);
			this.pos.y -= this.spd * dsin(this.dir);
		//collide with enemy	
			this.tryToCollide(_e);
		//out of grid
			var inx = this.pos.x >= 0 && this.pos.x < this.grid.w*this.grid.cSize,
				iny = this.pos.y >= 0 && this.pos.y < this.grid.h*this.grid.cSize;
			if (!inx || !iny) this.isDead = true;
		}
	};
	this.tryToCollide = function(_e) {
		for (var i = 0; i < _e.length; i++) {
			if (_e[i]) {
				var d = polarRadius(_e[i].pos.x - this.pos.x, _e[i].pos.y - this.pos.y);
				if (d <= _e[i].radius) {
					_e[i].life -= this.damage;
					this.isDead = true;
					break;
				}
			}
		}
	};
	this.draw = function() {
		var x = this.grid.drawOffsetX, y = this.grid.drawOffsetY;
		stroke(this.color);
		drawLine(x + this.pos.x, y + this.pos.y, x + this.prevPos.x, y + this.prevPos.y, this.grid.cSize/5);
	};
}

//-----------------------------------------------------------------------------------------------------------
//other types
function BaseCannonBullet(_g, _x, _y, _d) {
//inherition
	Bullet.call(this, _g, _x, _y, _d);
//parameters
	this.color = fill(hsv(33, 1, 0.7));
}

function AdvancedCannonBullet(_g, _x, _y, _d) {
//inherition
	Bullet.call(this, _g, _x, _y, _d);
//parameters
	this.damage = 1.5;
	this.spd = 10;
	this.color = fill(hsv(18, 1, 0.7));
}
