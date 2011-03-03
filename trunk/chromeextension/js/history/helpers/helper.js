var Helper = {};

(function(){
	var m = Helper;

	function get12Hour(hour){
		return {apm: (hour<12) ? "\u00a0AM":"\u00a0PM", hour: (hour%12)};
	}
	
	var brightness = [1, 0.7, 0.9, 0.94]; //2 level brightness values
	m.createLighterColor = function(color, level){
		if(typeof level == "undefined") throw "Color level is not defined";
		var r = parseInt(color.substr(1,2),16);
		var g = parseInt(color.substr(3,2),16);
		var b = parseInt(color.substr(5,2),16);
		var hsl = RGB.rgbToHsl(r, g, b);
		hsl[2]  = brightness[level];
		var rgb = RGB.hslToRgb(hsl[0], hsl[1], hsl[2]);
		return "#"+toCode(rgb[0])+toCode(rgb[1])+toCode(rgb[2]);

		function toCode(num){
			return m.padZero(Math.floor(num).toString(16), 2);
		}
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
