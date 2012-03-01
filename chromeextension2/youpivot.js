include("youpivot/js/history/datebox_controller.js");
style("/youpivot/controls.css");

var YouPivot = {};

(function(){
    var self = YouPivot;

    self.onAttached = function(){
    }

    self.populateTopbar = function(bar){
        var dateBox = DateBoxController.createDateBox();
        bar.append(dateBox);

        var datePicker = $('<div id="datePickers" />');
        bar.append(datePicker);

        var searchBox = $('<input type="search" id="searchBox" class="m-topsearch" />');
        bar.append(searchBox);
    }

    self.titleIcon = function(){
        return "images/large/youpivot.png";
    }

    // initialization
    if(Master){
        Master.addTab("youpivot", YouPivot, "YouPivot", "youpivot/youpivot.html");
    }
})();

