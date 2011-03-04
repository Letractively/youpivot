var DatePicker = {};

(function(){
	var m = DatePicker;
	var dateValues = ["now", "today", "yesterday", "more"];
	var def = "now";

	function pickDate(name){
		if(name=="more"){
			showCalender();
		}
		console.log("pickDate", name);
	}
	function showCalendar(){
		console.log("M T W T F... too lazy to type it all");
	}
	m.pickDate = function(name){
		$("#datePickers").hList("select", {name: name});
		pickDate(name);
	}

	$(function(){
		$("#datePickers").hList("loadArray", {items: dateValues, callback: pickDate});
		m.pickDate(def);
	});

})();
