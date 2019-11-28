			//math and draw

/*MATH*/

//const
const P = PI = Math.PI;
const R_TO_D = 180 / P;
const D_TO_R = P / 180;

//градусы в радианы
function degToRad(d) { return d * P / 180; }
//радианы в градусы
function radToDeg(r) { return r * 180 / P; }

//квадрат, корень и логарифм
function sqr(x)     { return Math.pow(x, 2); }
function pow(x, n)  { return Math.pow(x, n); }
function sqrt(x)    { return Math.sqrt(x); }
//function root(x, n) { return Math.f(x); }
function ln(x)      { return Math.log(x); }
	//function lg(x)      { return Math.log10(x); } //lg() is output function!
//function log(x, n)  { return Math.f(x); }

//тригонометрия
function sin(x) { return Math.sin(x); }
function cos(x) { return Math.cos(x); }
function  tg(x) { return Math.tan(x); }
function ctg(x) { return Math.cot(x); }
function sec(x) { return 1/Math.sin(x); }
function csc(x) { return 1/Math.cos(x); }
//обратные
function arcsin(x) { return Math.asin(x); }
function arccos(x) { return Math.acos(x); }
function  arctg(x) { return Math.atan(x); }
function arcctg(x) { return 1/Math.atan(x); }
function arcsec(x) { return 1/Math.acos(x); }
function arccsc(x) { return 1/Math.asin(x); }
//градусные
function dsin(x) { return Math.sin(degToRad(x)); }
function dcos(x) { return Math.cos(degToRad(x)); }
function  dtg(x) { return Math.tan(degToRad(x)); }
function dctg(x) { return Math.cot(degToRad(x)); }

//пол, потолок и округление
function floor(x) { return Math.floor(x); }
function ceil(x)  { return Math.ceil(x); }
function round(x) { return Math.round(x); }

//модуль и знак x
function abs(x) { return Math.abs(x); }
function sign(x) { return Math.sign(x); }

//целочисленное деление и остаток от деления x на y
function div(x, y) { return Math.floor(x / y); }
function mod(x, y) { return x - y * Math.floor(x / y); }

//минимальное и максимальное значение
function min() {
	var r = arguments[0];
	for (var i = 1; i < arguments.length; i++)
		if (arguments[i] < r) r = arguments[i];
	return r;
}
function max() {
	var r = arguments[0];
	for (var i = 1; i < arguments.length; i++)
		if (arguments[i] > r) r = arguments[i];
	return r;
}

//random
function random(x, y) {
	if (typeof x == "object" && x.length)
		return x[randomN(x.length)];
	if (x === undefined)
		return Math.random()
	else if (y === undefined)
		return Math.random()*x
	else
		return x + Math.random()*(y-x);
}

//random natural
function randomN(x, y) {
	if (x === undefined)
		return Math.floor(Math.random()+0.5)
	else if (y === undefined)
		return Math.floor(Math.random()*x)
	else
		return Math.floor(Math.random()*(y-x+1)+x);
}

//polar coordinates
function polarRadius(x, y) {
	return sqrt(sqr(x)+sqr(y));
}
function polarAngle(x, y) {
	if (x == 0) x = 0.00001;
	if (y == 0) y = 0.00001;
	
	var a = arctg(y / x);
	     if (x < 0) a += Math.PI;
	else if (y > 0) a += Math.PI*2;
	return a;
}

//среднее арифметическое
function average() {
	var s = 0, c = arguments.length;
	if (c == 0) return 0;
	for (var i = 0; i < c; i++)
		s += arguments[i];
	return s/c;
}

//triangle function [\/\/\/]
function triangle(x, n) {
	return n*Math.abs(2*x/n - 4*Math.floor(x/n/2 + 0.5))/2;
}

//saw function [/|/|/|/|]
function saw(x, n) {
	return n*(mod(x/n, 1)*(1+(x/n)/Math.abs(x/n))/2 + (1+mod(x/n, 1))*(1-(x/n)/abs(x/n))/2);
}

/*DRAW*/

var cx;

function setContext(context) {
	cx = context;
}

//fill background with color
function bgFill(c) {
	// 1
	if (c === undefined) c = 0;
	
	cx.fillStyle = c;
	cx.fillRect(0, 0, 9999, 9999);
}
//draw line from x1 y1 to x2 y2
function drawLine(x1, y1, x2, y2, l, s) {
	if (l === undefined) l = 2;
	cx.lineWidth = l;
	cx.lineCap = s || 'round';
	
	cx.beginPath();
	cx.moveTo(x1, y1);
	cx.lineTo(x2, y2);
	cx.stroke();
	//log("line! ("+x1+", "+x2+", "+y1+", "+y2+")");
}
//draw circle
function drawCircle(x, y, r, l) {
	if (l === undefined) l = 0;
	cx.lineWidth = l;
	
	cx.beginPath();
	cx.arc(x, y, r, 0, Math.PI*2, false);
	
	if (l) cx.stroke()
	else cx.fill();
	//log("circle! ("+x+", "+y+", "+r+")");
}
//draw sector
function drawSector(x, y, r, a1, a2, l) {
	if (l === undefined) l = 0;
	cx.lineWidth = l;
	
	cx.beginPath();
	
	cx.moveTo(x, y);
	cx.lineTo(x + r*cos(-a1), y + r*sin(-a1));
	cx.arc(x, y, r, -a1, -a2, true);
	cx.moveTo(x, y);
	cx.lineTo(x + r*cos(-a2), y + r*sin(-a2));
	
	if (l) cx.stroke()
	else cx.fill();
}
//draw square
function drawSquare(x, y, w, l) {
	if (l === undefined) l = 0;
	if (w === undefined) w = 1;
	
	if (l) cx.strokeRect(x, y, w, w)
	else cx.fillRect(x, y, w, w);
}
//draw rectangle
function drawRect(x, y, w, h, l) {
	if (l === undefined) l = 0;
	cx.lineWidth = l;
	
	cx.save();
	cx.translate(x, y);
	
	if (l) cx.strokeRect(0, 0, w, h)
	else cx.fillRect(0, 0, w, h);
	
	cx.restore() ;
}
function drawRectPos(x1, y1, x2, y2, l) {
	if (l === undefined) l = 0;
	cx.lineWidth = l;
	
	if (l) cx.strokeRect(x1, y1, x2-x1, y2-y1)
	else cx.fillRect(x1, y1, x2-x1, y2-y1);
}
//draw figure
function drawFigure() {
	var l = (typeof arguments[arguments.length-1] == 'number') ? arguments[arguments.length-1] : 0;
	
	cx.beginPath();

	cx.moveTo(arguments[0].x, arguments[0].y);
	for (var i = 1; i < arguments.length - +!!l; i++) {
		cx.lineTo(arguments[i].x, arguments[i].y);
	}
	
	if (l) cx.stroke()
	else cx.fill();
}


//color const
const BLACK   = rgb(  0,   0,   0),
      WHITE   = rgb(255, 255, 255);
      RED     = rgb(255,   0,   0),
      ORANGE  = rgb(255, 128,   0),
      YELLOW  = rgb(255, 255,   0),
      GREEN   = rgb(  0, 255,   0),
      CYAN    = rgb(  0, 255, 255),
      BLUE    = rgb(  0,   0, 255),
      MAGENTA = rgb(255,   0, 255);

//set fill color
function fill(c) {
	if (c === undefined) c = BLACK;
	cx.fillStyle = c;
	return c;
}
//set stroke color
function stroke(c) {
	if (c === undefined) c = BLACK;
	cx.strokeStyle = c;
	return c;
}

//return rgb color
function rgb(r, g, b, a) {
	if (!a) a = 1;
	// 255 255 255
	if (typeof r == 'object')
		return 'rgb('+r.r+', '+r.g+', '+r.b+')';
	else
		return 'rgba('+r+', '+g+', '+b+', '+a+')';
}

//return hsv color
function hsv(h, s, v, a) {
	if (!a) a = 1;
	
	if (h > 360) h -= 360;
	else if (h < 0) h += 360;
	
	// 360 1 1
	var c = v * s;
	var x = c * (1 - Math.abs((h/60)%2 - 1));
	var m = v - c;
	
	var dr, dg, db;
		 if (h <  60) { dr = c; dg = x; db = 0; }
	else if (h < 120) { dr = x; dg = c; db = 0; }
	else if (h < 180) { dr = 0; dg = c; db = x; }
	else if (h < 240) { dr = 0; dg = x; db = c; }
	else if (h < 300) { dr = x; dg = 0; db = c; }
	else if (h < 360) { dr = c; dg = 0; db = x; }
	
	var r = (dr + m) * 255;
	var g = (dg + m) * 255;
	var b = (db + m) * 255;
	
	return 'rgb('+r+', '+g+', '+b+', '+a+')';
}

//return gray color
function gray(g) {
	var v = g / 100 * 255;
	return 'rgb('+v+', '+v+', '+v+')';
}

/*OTHER*/

//return element by id
function $(id) { return document.getElementById(id); }

//full copy of object
function copy(o) {
	var n = {};
	for (var k in o) {
		var t = typeof o[k];
		if (o.hasOwnProperty(k)) {
			if (t === 'function' || t === 'object' && !!o)
				n[k] = copy(o[k]);
			else
				n[k] =  o[k];
		}
	}
	return n;
}
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

//key shuffling
function shuffle(arr, key) {
	var l = arr.length;
	
	for (var i = 0; i < l; i++) {
		
	}
}
