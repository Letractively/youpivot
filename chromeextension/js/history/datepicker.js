var DatePicker = {};

(function(){
	var m = DatePicker;
	var dateValues = ["now", "today", "yesterday", "more"];
	var def = "now";

	function pickDate(date){
		if(date=="more"){
			showCalendar();
			return false;
		}
		if(typeof date == "string"){
			date = translateDate(date);
		}
		console.log("pickDate", date);
		return true;
	}
	function translateDate(name){
		var d = new Date();
		switch(name){
			case "now":
				return d;
				break;
			case "today":
				return d;
				break;
			case "yesterday":
				d.setDate(d.getDate()-1);
				return d;
				break;
		}
	}
	function showCalendar(){
		$("#calendar").slideToggle(100);
	}
	m.pickDate = function(date){
		var label = (typeof date == "string") ? date : "more";
		$("#datePickers").hList("select", {name: label});
		pickDate(date);
	}

	$(function(){
		$("#datePickers").hList("loadArray", {items: dateValues, callback: pickDate});
		m.pickDate(def);
	});

})();
