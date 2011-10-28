include("js/views/datebox.js");

var DateBoxController = {};

/********** API ***********

setDate(startDate, endDate)

[DateBoxElement] createDateBox()

***************************/

(function(){
	var m = DateBoxController;
    
    var dateBox;

    m.createDateBox = function(){
        dateBox = $('<div id="dateBox" />').dateBox();
        dateBox.onDateChanged(onDateChanged);
        return dateBox.element;
    }

    m.setDate = function(startDate, endDate){
        dateBox.setDateDisplay(startDate, endDate);
        DatePicker.setDateDisplay(startDate, endDate);
    }

    function onDateChanged(event, startDate, endDate){
        // FIXME use pivotRange instead
        // probably pivot on noon to show the day?
        PivotManager.pivot((startDate+endDate)/2);
    }

})();
