// Helper class for format a date using PHP style date formatters. 

var DateFormatter = new (function _DateFormatter(){
    var self = this;

	self.formatDate = function(date, format){
        if(typeof date == "number")
            date = new Date(date);
		if(!format){
			return date.toLocaleDateString();
		}else{
            var output = __DateFormatter.format(date, format);
			return output;
		}
	}

	function get12Hour(hour){
		var apm = (hour<12) ? "\u00a0AM":"\u00a0PM";
		if(hour>12) hour -= 12;
		else if(hour==0) hour = 12;
		return {apm: apm, hour: hour};
	}

	self.formatTime = function(date, f12_24){
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
		min = self.padZero(d.getMinutes(), 2);
		var string = h+":"+min+apm;
		return string;
	}

	self.padZero = function(string, len){
		var output = string+"";
		for(var i=output.length; i<len; i++){
			output = "0"+output;
		}
		return output;
	}
    
    /*** Date formatter (PHP style) ***/
	//usage: <Date object>.format(-format-);
	var __DateFormatter = {};

	__DateFormatter.format = function(d, form){
		var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var fullWeeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var shortWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		var formats = {
			//day of month
			d: function(d){return self.padZero(d.getDate(),2);},
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
			m: function(d){return self.padZero(d.getMonth+1,2);},
            // time
            H: function(d){return d.getHours();},
            h: function(d){return d.getHours()%12;},
            a: function(d){return (d.getHours/12 < 1) ? "am" : "pm";}
		};

		var namespace = "";
		for(var i in formats){
			namespace += i;
		}

		var regex = new RegExp("(["+namespace+"])", "g");
		form = form.replace(regex, function(a){ return formats[a](d); });
		return form;
	};
    /*** End Date formatter ***/
})();
