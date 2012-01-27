// Helper class for format a date using PHP style date formatters. 

var DateUtilities = new (function _DateUtilities(){
    var self = this;

    self.getNoonDay = function(date){
        var d = new Date(date);
		d.setHours(12);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
    }

    self.getMidnightDay = function(date){
        var d = new Date(date);
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
    }
})();
