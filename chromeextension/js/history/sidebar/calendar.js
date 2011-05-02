var CalManager = {};
/**
 *	CalManager manages the small calendar on the left sidebar. 
 *	It is called upon when the "more" button in the datepicker is pressed
 *	Note that calendar is different from datepicker: 
 *		datepicker is the horizontal list showing "now | today | yesterday |..."
 *		calendar is the month view that shows up when you press "more"
 */

(function(){
	var m = CalManager;

	//loads the calendar/datepicker on the left sidebar
	function loadCalendar(){
		//jQuery UI datepicker. See its documentation for info. 
		$("#calendar").datepicker({
			onSelect: selectDate,
			showOtherMonths: true,
			selectOtherMonths: true
		});
	}

	var startRange = false; //the start of the pivoting range. Used when shift is held. 
	//invoked when a date is selected in the calendar
	function selectDate(dateText, inst){
		var date = $(this).datepicker("getDate");
		if(shiftPressed){
			$(this).datepicker("option", "minDate", date);
			if(startRange===false){
				startRange = date;
			}else{
				PivotManager.pivotRange(startRange, date);
				resetShiftState();
			}
		}else{
			DatePicker.pickDate(date);
			$(this).slideUp(100);
		}
	}

	//reset the calendar to original state when shift is released
	function resetShiftState(){
		var graphTime = GraphManager.getRange().start;
		$("#calendar").datepicker("option", "minDate", null).datepicker("setDate", graphTime);
		startRange = false;
	}
	
	var shiftPressed = false; //boolean storing the state of the shift button
	$(document).keydown(function(e){
		if(e.which==16){
			shiftPressed = true;
		}
	}).keyup(function(e){
		if(e.which==16){
			resetShiftState();
			shiftPressed = false;
		}
	});

	$(function(){
		loadCalendar();
	});
})();
