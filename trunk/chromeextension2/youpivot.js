include("youpivot/js/history/datebox_controller.js");

var YouPivot = {};

(function(){
    var m = YouPivot;

    m.onAttached = function(){
    }

    m.populateTopbar = function(bar){
        var dateBox = DateBoxController.createDateBox();
        bar.append(dateBox);

        var datePicker = $('<div id="datePickers" />');
        bar.append(datePicker);

        var searchBox = $('<input type="search" id="searchBox" />');
        bar.append(searchBox);
    }

    m.tabImage = function(){
        return "images/tab_youpivot.png";
    }

    m.titleIcon = function(){
        return "images/titleicon_youpivot.png";
    }

    // initialization
    if(Master){
        Master.addTab("youpivot", YouPivot, "YouPivot", "youpivot/youpivot.html");
    }
})();

