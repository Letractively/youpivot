// helper class providing miscellaneous helper functions

var Helper = new (function _Helper(){
	var self = this;

	self.showLoading = function(){
		$("#y-spinner").show();
		$("#content").parent().prepend("<div id='blocker' style='z-index: 999999; position: fixed; height: 100%; width: 100%; top: 35px; left: 0px; cursor: progress'></div>");
	}

	self.hideLoading = function(){
		$("#y-spinner").hide();
		$("#blocker").remove();
	}

	self.getOptions = function(options, label, defaultValue){
		if(!options || options[label] == undefined){
			return defaultValue;
		}
		return options[label];
	}

	self.createLighterColor = function(color, level, type){
		if(level == "transparent"){
			return "transparent";
		}
		if(typeof level == "undefined" || level>1 || level<0){
			console.log("Invalid color level "+level);
			console.trace();
			return color;
		}
		var r = parseInt(color.substr(1,2),16);
		var g = parseInt(color.substr(3,2),16);
		var b = parseInt(color.substr(5,2),16);
		if(level == "same"){
			return [r, g, b, 255];
		}
		var hsl = RGB.rgbToHsl(r, g, b);
		if(typeof level == "string" && (level.indexOf("+")==0 || level.indexOf("-")==0)){
			level = parseFloat(level);
			hsl[2] += level;
			if(hsl[2]>0.9) hsl[2] = 0.9; //cap brightness value at 0.96
		}else{
			hsl[2] = level;
		}
		hsl[1] -= level*0.3;
		if(hsl[1]<0) hsl[1] = 0;
		var rgb = RGB.hslToRgb(hsl[0], hsl[1], hsl[2]);
        if(type == "array"){
            rgb.push(255);
            return rgb;
        }else{
            return "rgb("+rgb.join(",")+")";;
        }

        /*
		function toCode(num){
			return self.padZero(Math.floor(num).toString(16), 2);
		}
        */
	}

	self.padZero = function(string, len){
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
            if(max == r)
			    h = (g - b) / d + (g < b ? 6 : 0);
            else if(max == g)
				h = (b - r) / d + 2;
            else if(max == b)
				h = (r - g) / d + 4;
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
