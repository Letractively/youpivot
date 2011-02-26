var Helper = {};

(function(){
	var m = Helper;

	function get12Hour(hour){
		return {apm: (hour<12) ? "\u00a0AM":"\u00a0PM", hour: (hour%12)};
	}
	
	var brightness = [100, 200, 300]; //2 level brightness values
	m.createLighterColor = function(color, level){
		var r = parseInt(color.substr(1,2),16);
		var g = parseInt(color.substr(3,2),16);
		var b = parseInt(color.substr(5,2),16);
		var cb = (r+g+b)/3; var db = brightness[level]-cb;
		r+=db; g+=db; b+=db;
		if(r>255) r = 255;
		if(g>255) g = 255;
		if(b>255) b = 255;
		return "#"+m.padZero(r.toString(16), 2)+m.padZero(g.toString(16), 2)+m.padZero(b.toString(16), 2);
	}

	m.formatDate = function(date){
		var d = new Date(date);
		return d.toLocaleDateString();
	}

	m.formatTime = function(date, f12_24){
		if(typeof date == "object"){
			throw "Format time only accepts unix epoch time";
			return "format error";
		}
		if(f12_24 != 12 && f12_24 != 24){
			throw "Unknown hour format. Please input 12 or 24";
			return "format error";
		}
		var d = new Date(date);
		var apm = "";
		var h = d.getHours();
		if(f12_24==12){
			var hObj = get12Hour(h);
			apm = hObj.apm;
			h = hObj.hour;
		}
		h = h;
		min = m.padZero(d.getMinutes(), 2);
		var string = h+":"+min+apm;
		return string;
	}

	m.padZero = function(string, len){
		var output = string+"";
		for(var i=output.length; i<len; i++){
			output = "0"+output;
		}
		return output;
	}
})();
