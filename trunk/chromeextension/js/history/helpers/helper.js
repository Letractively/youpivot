var Helper = {};

(function(){
	var m = Helper;

	m.showLoading = function(){
		$("#spinner").show();
		$("body :visible").css("cursor", "progress");
	}

	m.hideLoading = function(){
		$("#spinner").hide();
		$("body :visible").css("cursor", "auto");
	}

	m.getOptions = function(options, label, defaultValue){
		if(!options || options[label] == undefined){
			return defaultValue;
		}
		return options[label];
	}

	m.htmlEntities = function(string){
		return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");		
	}

	//return an exponentially decaying number (0,1]
	m.decay = function(num, rate, best){
		//exponential decay
		return Math.log((num+1)/rate)/Math.log((best+1)/rate);
		//+1 to prevent the value actually going to 0
	}

	function get12Hour(hour){
		var apm = (hour<12) ? "\u00a0AM":"\u00a0PM";
		if(hour>12) hour -= 12;
		else if(hour==0) hour = 12;
		return {apm: apm, hour: hour};
	}
	
	m.createLighterColor = function(color, level){
		if(level == "same"){
			return color;
		}
		if(level == "transparent"){
			return "transparent";
		}
		if(typeof level == "string"){
			throw "Error: Create lighter color by string is deprecated "+level;
			console.trace();
			level = translateLevel(level);
		}
		if(typeof level == "undefined" || level>1 || level<0){
			console.log("Invalid color level "+level);
			console.trace();
			return color;
		}
		var r = parseInt(color.substr(1,2),16);
		var g = parseInt(color.substr(3,2),16);
		var b = parseInt(color.substr(5,2),16);
		var hsl = RGB.rgbToHsl(r, g, b);
		hsl[2] = level;
		hsl[1] -= level*0.3;
		if(hsl[1]<0) hsl[1] = 0;
		var rgb = RGB.hslToRgb(hsl[0], hsl[1], hsl[2]);
		return "#"+toCode(rgb[0])+toCode(rgb[1])+toCode(rgb[2]);

		function toCode(num){
			return m.padZero(Math.floor(num).toString(16), 2);
		}
		function translateLevel(string){
			if(string=="highbg") return 0.9;
			if(string=="lowbg") return 0.96;
			if(string=="high") return 0.7;
			if(string=="med") return 0.75;
			if(string=="low") return 0.8;
			console.log("Unknown color string "+string);
			return -1;
		}
	}

	m.formatDate = function(date, format){
		var d = new Date(date);
		if(!format){
			return d.toLocaleDateString();
		}else{
			return d.format(format);
		}
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

/*** RGB Helper code ***/
	var RGB = {};

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and l in the set [0, 1].
	 *
	 * @param   Number  r       The red color value
	 * @param   Number  g       The green color value
	 * @param   Number  b       The blue color value
	 * @return  Array           The HSL representation
	 */
	RGB.rgbToHsl = function(r, g, b){
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h, s, l];
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  l       The lightness
	 * @return  Array           The RGB representation
	 */
	RGB.hslToRgb = function(h, s, l){
		var r, g, b;

		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
	}

/*** End RGB Helper code ***/

/*** Date formatter (PHP style) ***/
	//usage: <Date object>.format(-format-);
	var DateFormatter = {};

	DateFormatter.format = function(d, form){
		var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var fullWeeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var shortWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		var formats = {
			//day of month
			d: function(d){return Helper.padZero(d.getDate(),2);},
			j: function(d){return d.getDate();},
			//day of week
			l: function(d){return fullWeeks[d.getDay()];},
			D: function(d){return shortWeeks[d.getDay()];},
			w: function(d){return d.getDay();},
			//year
			Y: function(d){return d.getFullYear();},
			//month
			F: function(d){return fullMonths[d.getMonth()];},
			M: function(d){return shortMonths[d.getMonth()];},
			n: function(d){return d.getMonth()+1; },
			m: function(d){return Helper.padZero(d.getMonth+1,2);}
		};

		var namespace = "";
		for(var i in formats){
			namespace += i;
		}

		var regex = new RegExp("(["+namespace+"])", "g");
		form = form.replace(regex, function(m){ return formats[m](d); });
		return form;
	};

	Date.prototype.format = function(format){
		return DateFormatter.format(this, format);
	}

/*** End Date formatter ***/
