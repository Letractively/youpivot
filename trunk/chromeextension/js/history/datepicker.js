var DatePicker = {};

(function(){
	var m = DatePicker;
	var dateValues = ["now", "today", "yesterday", "more"];
	var def = "now";

	function pickDate(date){
		if(date=="more"){
			toggleCalendar();
			return false;
		}
		if(typeof date == "string"){
			date = translateDate(date);
		}
		date.setHours(12);
		PivotManager.pivot(date);
		$("#calendar").datepicker("setDate", date);
		return true;
	}
	function translateDate(name){
		var d = new Date();
		switch(name){
			case "now":
				return d;
				break;
			case "today":
				return noonDay(d);
				break;
			case "yesterday":
				d.setDate(d.getDate()-1);
				return noonDay(d);
				break;
		}
	}
	function noonDay(d){
		d.setHours(12);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	}
	m.pickDate = function(date){
		var label = (typeof date == "string") ? date : "more";
		$("#datePickers").hList("select", {name: label});
		pickDate(date);
	}
	function toggleCalendar(){
		if($("#calendar").is(":visible")){
			$("#calendar").slideUp(100);
		}else{
			$("#calendar").slideDown(100);
		}
	}
	function hideCalendar(){
		$("#calendar").slideUp(100);
	}
	$(document).click(function(){
		hideCalendar();
	});

	$(function(){
		$("#datePickers").hList("loadArray", {items: dateValues, callback: pickDate});
		m.pickDate(def);
	});

})();
