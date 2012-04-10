include_("DateFormatter");
include_("ArrowBox");
include_("jUI");

style("include/jui/jquery-ui-1.8.10.custom.css");
style("js/views/datebox.css");

// uses arrowBox to implement a calendar implementation for dateBox

(function($){
	$.fn.dateBox = function(){
		return new DateBox(this);
    }

    // Instance class declaration
    var DateBox = function(obj){
        var self = this;

        // instance variables
        self.element = obj;
        self.startDate = 0;
        self.endDate = 0;
        self.interval = 86400000;
        self.roundOff = false;

        // private instance variables
        var arrowBox;

        // initializer
        (function init(){
            arrowBox = self.element.arrowBox();
            arrowBox.setText("");
            arrowBox.pressLeft(moveToDayBefore);
            arrowBox.pressRight(moveToDayAfter);
            arrowBox.pressDisplay(showCalendar);

            self.element.append('<div class="DBCalendar"></div>');
            $(".DBCalendar", self.element).datepicker({
                onSelect: selectDate,
                showOtherMonths: true,
                selectOtherMonths: true
            });

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

            $(document).click(function(e){
                if(!$(e.target).hasClass("ABDisplay")){
                    self.element.find(".DBCalendar").slideUp(100);
                }
            });
            self.element.find(".DBCalendar").click(function(e){
                e.stopPropagation();
            });
        })();

        // public methods
        this.setDateDisplay = function(startDate, endDate){
            setDateDisplay(startDate, endDate);
        }

        this.onDateChanged = function(func){
            self.element.bind("datechanged", func);
        }

        // private methods
        function moveToDayBefore(){
            var referenceDate = dateAtInterval(self.startDate, self.interval);
            if(!self.roundOff){
                setDate(self.startDate-self.interval, self.startDate-1);
                return;
            }
            if(self.startDate == referenceDate)
                setDate(referenceDate - self.interval, referenceDate - 1);
            else
                setDate(referenceDate, referenceDate + self.interval - 1);
        }

        function moveToDayAfter(){
            var referenceDate = dateAtInterval(self.endDate, self.interval);
            if(!self.roundOff){
                setDate(self.endDate+1, self.endDate+self.interval);
                return;
            }
            if(self.endDate >= referenceDate+self.interval-1){
                setDate(referenceDate + self.interval, referenceDate + (self.interval*2) -1 );
            }else{
                setDate(referenceDate, referenceDate + self.interval - 1);
                console.log("day", new Date(self.endDate), new Date(referenceDate));
            }
        }

        function showCalendar(){
            var calendar = $(".DBCalendar", self.element);
            if(calendar.is(":visible")){
                calendar.slideUp(100);
            }else{
                calendar.slideDown(100);
            }
        }

        function setDate(startDate, endDate){
            setDateDisplay(startDate, endDate);
            self.element.trigger("datechanged", [self.startDate, self.endDate]);
        }

        function setDateDisplay(startDate, endDate){
            if(typeof startDate == "number")
                startDate = new Date(startDate);
            self.startDate = startDate.getTime();

            if(typeof endDate == "number")
                endDate = new Date(endDate);
            else if(endDate === undefined)
                endDate = startDate;
            self.endDate = endDate.getTime(); 

            var text = formatDateRange(startDate, endDate);
            arrowBox.setText(text);
        }

        var startRange = false; //the start of the pivoting range. Used when shift is held. 

        function selectDate(dateText, inst){
            var date = $(this).datepicker("getDate");
            if(shiftPressed){
                $(this).datepicker("option", "minDate", date);
                if(startRange===false){
                    startRange = date;
                }else{
                    setDate(startRange, date);
                    //PivotManager.pivotRange(startRange, date);
                    resetShiftState();
                    $(this).slideUp(100);
                }
            }else{
                setDate(date);
                //DatePicker.pickDate(date);
                $(this).slideUp(100);
            }
        }

        var shiftPressed = false; //boolean storing the state of the shift button

        //reset the calendar to original state when shift is released
        function resetShiftState(){
            $(".DBCalendar", self.element).datepicker("option", "minDate", null).datepicker("setDate", self.startDate);
            startRange = false;
        }

        function formatDateRange(startDate, endDate){
            var endText = DateFormatter.formatDate(endDate, "F d, Y");

            if(startDate.getFullYear() != endDate.getFullYear()){
                // Different year
                var startText = DateFormatter.formatDate(startDate, "F d, Y");
                return startText + " - " + endText;

            }else if(startDate.getMonth() != endDate.getMonth()){
                // Different month of same year
                var startText = DateFormatter.formatDate(startDate, "F d");
                return startText + " - " + endText;

            }else if(startDate.getDate() != endDate.getDate()){
                // Different date of same month
                var startText = DateFormatter.formatDate(startDate, "F d");
                endText = DateFormatter.formatDate(endDate, "d, Y");
                return startText + " - " + endText;

            }else{
                // YMD all equal
                return endText;
            }

        }

        function dateAtInterval(date, interval){
            var midnight = dateAtMidnight(date);
            var numInterval = Math.floor((date - midnight) / interval);
            return midnight += interval * numInterval;
        }

        function dateAtMidnight(date){
            d = new Date(date);
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d.getTime();
        }

    }
})(jQuery);
