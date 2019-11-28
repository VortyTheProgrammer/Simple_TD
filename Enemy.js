//base enemy function

function Enemy(_g, _n) {
//base
	this.grid = _g;
	this.pathNumb = _n;
	this.path = this.grid.paths[this.pathNumb];
//movement
	this.spd = 1;
	this.progress = 0;
	this.offset = 0;
	this.cell = this.grid.c;
//draw
	this.dir = 0;
	this.pos = {x: 0, y: 0};
//life
	this.maxLife = 3;
	this.life = 0;
	this.isDead = false;
	this.radius = this.grid.cSize/3;
//other
//functions
	this.start = function() {
	//set movement
		this.progress = 0;
		this.offset = 0;
	//set position
		this.updatePos();
	//set life
		this.life = this.maxLife;
	};
	this.updateMove = function() {
	//move
		if (!this.isDead) this.offset += this.spd;
	//end of cell
		if (this.offset >= this.cell) {
			var moves = 0;
			while (this.offset >= this.cell) {
				this.offset -= this.cell;
				moves++;
			}
			this.progress += moves;
		}
	//end of path
		if (this.progress >= this.path.length-1) {
			this.isDead = true;
			damageTarget(this.life);
			this.progress = this.path.length-1;
		}
	//dead
		if (!this.isDead && this.life <= 0) {
			this.isDead = true;
		}
	};
	this.updatePos = function() {
		var p = this.path[this.path.length-1 - this.progress],
			cm = this.offset/this.cell*this.grid.cSize;
		this.dir = p.d;
		this.pos.x = (p.x+0.5)*this.grid.cSize + dcos(this.dir)*cm;
		this.pos.y = (p.y+0.5)*this.grid.cSize - dsin(this.dir)*cm;
	};
	this.update = function() {
		if (!this.isDead) {
			this.updateMove();
			this.updatePos();
		}
	};
	this.draw = function() {
		var x = this.grid.drawOffsetX, y = this.grid.drawOffsetY, s = this.grid.cSize;
		fill(stroke(BASECOLOR));
		drawCircle(x + this.pos.x, y + this.pos.y, this.radius);
	};
	this.drawLife = function() {
		if (this.life > 0 && this.life != this.maxLife) {
			var s = this.grid.cSize,
				x = this.grid.drawOffsetX + this.pos.x - s/2,
				y = this.grid.drawOffsetY + this.pos.y - s/2;
			var w = 0.8*s,
				h = s/10, l = s/12;
			fill(BLACK);
			drawRect(x+(s-w)/2, y-l-h, w, h);
			var p = this.life / this.maxLife,
				c = p * 120;
			fill(hsv(c, 1, 1));
			drawRect(x+(s-w)/2, y-l-h, w*p, h);
		}
	};
}

//-----------------------------------------------------------------------------------------------------------
//other types
function BaseWorm(_g, _n) {
//inherition
	Enemy.call(this, _g, _n);
//parameters
	this.spd = 0.5;
	this.maxLife = 5;
	this.wave = 0;
//functions
	this.draw = function() {
		this.wave += 5;
		var x = this.grid.drawOffsetX + this.pos.x,
			y = this.grid.drawOffsetY + this.pos.y,
			s = this.grid.cSize,
			d = this.dir;
		fill(stroke(hsv(200, 1, 0.5)));
		for (var i = -s/2; i < s/2; i += 1.8) {
		//calc
			var px = 0, py = 0;
			var w = s/8 * dcos(i / s * 540) * dsin(this.wave);
		//apply
			if (this.dir ==  0 || this.dir == 180) { px = i; py = w; }
			if (this.dir == 90 || this.dir == 270) { px = w; py = i; }
		//draw
			drawCircle(x + px, y + py, s/15);
		}
	}
}
