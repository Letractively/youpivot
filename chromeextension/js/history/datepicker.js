var DatePicker = {};

(function(){
	var m = DatePicker;
	var dateValues = ["now", "today", "yesterday", "more \u25be"];
	var def = "now";

	function pickDate(date){
		if(date.indexOf("more")==0){
			toggleCalendar();
			return false;
		}
		if(typeof date == "string"){
			date = translateDate(date);
		}else{
			date.setHours(12);
		}
		PivotManager.pivot(date);
		$("#calendar").datepicker("setDate", date);
		return true;
	}
	function translateDate(name){
		var d = new Date();
		switch(name){
			case "now":
				//now is the end point instead of the center
				return new Date(d.getTime()-43200000);
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
	$("#calendar").click(function(e){
		e.stopPropagation();
	});
	$(document).click(function(e){
		hideCalendar();
	});

	$(function(){
		$("#datePickers").hList("loadArray", {items: dateValues, callback: pickDate});
		m.pickDate(def);
	});

})();
