include("js/views/datebox.js");

/********** API ***********

setDate(startDate, endDate)

[DateBoxElement] createDateBox()

***************************/

var DateBoxController = new (function _DateBoxController(){
    var self = this;
    
    var dateBox;

    self.createDateBox = function(){
        dateBox = $('<div id="dateBox" />').dateBox();
        dateBox.onDateChanged(onDateChanged);
        return dateBox.element;
    }

    self.setDate = function(startDate, endDate){
        dateBox.setDateDisplay(startDate, endDate);
        DatePicker.setDateDisplay(startDate, endDate);
    }

    function onDateChanged(event, startDate, endDate){
        // FIXME use pivotRange instead
        // probably pivot on noon to show the day?
        PivotManager.pivot((startDate+endDate)/2);
    }

})();
