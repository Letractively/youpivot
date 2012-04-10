include_("DateBoxController");
include_("GraphManager");
include_("SidebarManager");
include_("ItemManager");
include_("ShadowManager");
include_("PivotManager");
style("/youpivot/controls.css");

var YouPivot = {};

(function(){
    var self = YouPivot;

    // initialization
    self.init = function(){
        Master.addTab("youpivot", YouPivot, "YouPivot", "youpivot/youpivot.html");
    }

    self.onAttached = function(){
    }

    self.onCreate = function(){
        GraphManager.init();
        ItemManager.init();
        ShadowManager.init();
        PivotManager.init();
        SidebarManager.init();
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

})();

