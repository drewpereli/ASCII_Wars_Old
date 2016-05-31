
function Random(seed) {
	
	this.lastRand = seed;
	
	var m = Math.pow(2, 32);
	var a = 1664525;
	var c = 1013904223;

	this.next = function(min, max){
		
		var newRand = (a * this.lastRand + c) % m;
		this.lastRand = newRand;
		
		return newRand / m * (max - min) + min;
	}

	this.nextInt = function(min, max){
		return Math.floor(this.next(min, max));
	}
}