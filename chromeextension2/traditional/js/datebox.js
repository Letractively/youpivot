include_("DateBox");

/********** API ***********

setDate(startDate, endDate)

[DateBoxElement] createDateBox()

***************************/

var THDateBoxController = new (function _THDateBoxController(){
    var self = this;
    
    var dateBox;

    self.createDateBox = function(){
        dateBox = $('<div id="th-dateBox" />').dateBox();
        dateBox.onDateChanged(onDateChanged);
    }

    self.getDateBox = function(){
        if(!dateBox){
            self.createDateBox();
        }
        return dateBox.element;
    }

    self.setDate = function(startDate, endDate){
        dateBox.setDateDisplay(startDate, endDate);
        //DatePicker.setDateDisplay(startDate, endDate);
    }

    function onDateChanged(event, startDate, endDate){
        HistoryList.setOldest(startDate);
        console.log(new Date(startDate), new Date(endDate));
    }

    $(function(){
        if(!dateBox)
            self.createDateBox();
        var endDate = new Date().getTime();
        var startDate = endDate - 86399999;
        dateBox.setDateDisplay(startDate, endDate);
        dateBox.interval = 43200000;
    });

})();
