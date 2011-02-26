var DatePicker = {};

(function(){
	var m = DatePicker;
	var dateValues = ["now", "today", "yesterday", ["more1", "more2"]];
	var def = "now";

	function pickDate(obj){
		$("#datePickers .active").removeClass("active");
		obj.addClass("active");
		if(obj.parent().attr("id")=="moreDates")
			$("#moreDateBtn").addClass("active");
		$("#moreDates").hide();
		console.log("Pick date", obj.html());
	}
	m.pickDate = function(name){
		pickDate(getBtn(name));
	}
	function getBtn(name){
		var obj = false;
		$("#datePickers a").each(function(){
			if($(this).text()==name){
				obj = $(this);
				return;
			}
		});
		return obj;
	}

	$(function(){
		m.list = new HorizontalList("Date", dateValues, pickDate);
		m.pickDate(def);
	});

})();
