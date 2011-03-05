var CalManager = {};

(function(){
	var m = CalManager;

	function loadCalendar(){
		$("#calendar").datepicker({
			onSelect: function(dateText, inst){
						  var date = $(this).datepicker("getDate");
						  DatePicker.pickDate(date);
						  $(this).slideUp(100);
					 }
		});
	}

	$(function(){
		loadCalendar();
	});
})();
