//grid of cells

function Grid(_w, _h, _c, _l) {
//size
	this.w = _w || 1;
	this.h = _h || 1;
	this.c = _c || 10;
//base
	this.array = [];
	this.target = {
		x: 0, y: 0,
		maxLife: _l || 50,
		life: 0
	};
	this.paths = [];
	this.pathNumber = 0;
//draw
	this.drawOffsetX = 0;
	this.drawOffsetY = 0;
	this.targetlight = 0;
	this.cSize = 0;
//functions
	this.start = function() {
	//array
		this.array = new Array(this.h);
		for (var j = 0; j < this.h; j++) {
			this.array[j] = new Array(this.w);
			for (var i = 0; i < this.w; i++) {
				this.array[j][i] = {block: true, color: gray(30 + random(-2, 2))};
			}
		}
	//draw
		this.cSize = floor(min((width - 2*20)/this.w, (height - 2*20)/this.h));
		this.drawOffsetX = (width  - this.w*this.cSize)/2;
		this.drawOffsetY = (height - this.h*this.cSize)/2;
	//life
		this.target.life = this.target.maxLife;
	};
	this.setPaths = function(_count) {
		this.pathNumber = _count;
	//set target
		this.target.x = randomN(2*div(this.w, 5), 3*div(this.w, 5));
		this.target.y = randomN(2*div(this.h, 5), 3*div(this.h, 5));
		this.array[this.target.y][this.target.x].block = false;
	//create helpfull functions
	//is this cell are blocked?
		var isblock = function(arr, x, y) {
			var h = arr.length, w = arr[0].length;
			var px = (x) => (x < 0) ? 0 : (x > w-1) ? w-1 : x,
				py = (y) => (y < 0) ? 0 : (y > h-1) ? h-1 : y;
			if (x != px(x) || y != py(y))
				return true;
			else
				return arr[y][x].block;
		};
	//can turtle go to this cell?
		var isfree = function(arr, x, y) {
			if (!isblock(arr, x, y)) return false;
			var u = !isblock(arr, x, y-1),
				d = !isblock(arr, x, y+1),
				l = !isblock(arr, x-1, y),
				r = !isblock(arr, x+1, y);
			return !(u+d+l+r >= 2);
		};
	//for every path
		for (var n = 0; n < _count; n++) {
		//create turtle
			var turtle = {x: this.target.x, y: this.target.y, inarray: true, path: []};
			turtle.path.push({x: turtle.x, y: turtle.y});
		//create helpfull array
			var free = new Array(this.h);
			for (var j = 0; j < this.h; j++) {
				free[j] = new Array(this.w);
				for (var i = 0; i < this.w; i++)
					free[j][i] = {block: this.array[j][i].block};
			}
		//loop
			while (turtle.inarray) {
			//set this cell
				free[turtle.y][turtle.x].block = false;
			//add all possible moves
				var move = [];
				if (isfree(free, turtle.x, turtle.y-1)) move.push(90); //up
				if (isfree(free, turtle.x, turtle.y+1)) move.push(270); //down
				if (isfree(free, turtle.x-1, turtle.y)) move.push(180); //left
				if (isfree(free, turtle.x+1, turtle.y)) move.push(0); //right
			//if turtle can move, apply move
				if (move.length) {
				//set dir
					var dir = random(move);
				//move turtle
					switch (dir) {
						case  90: turtle.y--; break; //up
						case 270: turtle.y++; break; //down
						case 180: turtle.x--; break; //left
						case   0: turtle.x++; break; //right
					}
				//save path
					turtle.path.push({x: turtle.x, y: turtle.y, d: mod(dir + 180, 360)});
				}
			//else, go back of path
				else {
				//if turtle can go back
					if (turtle.path.length > 1) {
					//block this position
						free[turtle.y][turtle.x].block = false;
					//delete previous position
						turtle.path.pop();
					//go back
						var pos = turtle.path[turtle.path.length-1];
						turtle.x = pos.x;
						turtle.y = pos.y;
					}
					else if (n) {
					//choose path
						var path = random(this.paths);
					//set path
						var ind = randomN(path.length);
						turtle.path = path.slice(0, ind+1);
					//set pos
						var pos = path[ind];
						turtle.x = pos.x;
						turtle.y = pos.y;
					}
					else {
						console.log("Невозможно построить "+(n+1)+" путь!");
						break;
					}
				}
			//check, if turtle in field
				turtle.inarray = min(turtle.x, turtle.y) >= 0 && max(turtle.x-this.w, turtle.y-this.h) < 0;
			}
		//add path
			this.paths.push(turtle.path);
		//create path in array
			for (var i = 0; i < turtle.path.length-1; i++)
				this.array[turtle.path[i].y][turtle.path[i].x].block = false;
			free[0] = undefined;
		}
	};
	this.drawGrid = function() {
		var x = this.drawOffsetX, y = this.drawOffsetY, s = this.cSize;
	//draw grid
		fill(gray(30));
		for (var j = 0; j < this.h; j++) {
			for (var i = 0; i < this.w; i++) {
				fill(this.array[j][i].color);
				drawRect(x + i*s, y + j*s, s+1, s+1);
			}
		}
	//draw path
		for (var l = 0; l < 2; l++) {
			stroke(gray(10 - 5*l));
			for (var n = 0; n < this.paths.length; n++) {
				for (var i = 1; i < this.paths[n].length; i++) {
					var p = this.paths[n][i],
						cx = x + (p.x + 0.5)*s,
						cy = y + (p.y + 0.5)*s;
					drawLine(cx, cy, cx + dcos(p.d) * s, cy - dsin(p.d) * s, s - 0.4*s*l);
				}
			//test
				var p = this.paths[n][this.paths[n].length-2];
				ctx.font = "30px Arial";
				fill(gray(10));
				ctx.fillText(n+1, x + p.x*s + s/3, y + (p.y+1)*s - s/4);
			}
		}
	//draw border
		stroke(gray(2));
		drawRect(x - s/2, y - s/2, (this.w+1)*s, (this.h+1)*s, this.cSize + 1);
	};
	this.drawTarget = function() {
		this.targetlight += 4;
	//draw target
		var cx = this.drawOffsetX + (this.target.x + 0.5)*this.cSize,
			cy = this.drawOffsetY + (this.target.y + 0.5)*this.cSize,
			h = this.cSize/2*1.25,
			m = h*0.75;
		fill(hsv(0, 0, 0.75 - dsin(this.targetlight)/4));
		drawFigure(
			{x: cx-h, y: cy-m}, {x: cx-m, y: cy-h}, {x: cx+m, y: cy-h}, {x: cx+h, y: cy-m},
			{x: cx+h, y: cy+m}, {x: cx+m, y: cy+h}, {x: cx-m, y: cy+h}, {x: cx-h, y: cy+m}
		);
	};
	this.drawTargetLife = function() {
		ctx.font = "50px Arial";
		var text = this.target.life,
			s = ctx.measureText(text), w = s.actualBoundingBoxRight,
			h = s.actualBoundingBoxAscent + s.actualBoundingBoxDescent,
			c = 20, l = 5,
			hue = this.target.life / this.target.maxLife * 120;
	//draw border
		fill(gray(0));
		drawRect(0, height, 2*c + w, -(2*c + h));
		fill(stroke(hsv(hue, 1, 1)));
		drawRect(l/2, height - l/2, 2*c + w - l, -(2*c + h - l), l);
	//draw text
		ctx.fillText(text, c, height - c);
	};
}
