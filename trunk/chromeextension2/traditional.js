style("/traditional/css/controls.css");
include_("THDateBoxController");
include_("THDomainManager");
include_("THTermManager");
include_("HistoryList");
include_("THSearch");
include_("THFilterManager");

var TraditionalHistory = new (function _TraditionalHistory(){
    var self = this;

    // initialization
    self.init = function(){
        Master.addTab("traditionalhistory", self, "History", "traditional/history.html");
    }
    
    self.onCreate = function(){
        var bar = Master.createSidebar("traditionalhistory");
        bar.attr("id", "h-leftSidebar");
        bar.find(".m-sidebarTitle span").text("Traditional History");
        bar.append('<div class="sidebarGroup"><div class="sidebarLabel" id="th-contentLabel">Content</div><div id="th-contentFilters" class="collapse view_Collapsable" data-indicator="true" data-handle="#th-contentLabel"></div></div>');
        bar.append('<div class="sidebarGroup"><div class="sidebarLabel" id="th-termsLabel">Terms</div><div id="th-termFilters" class="collapse view_Collapsable" data-indicator="true" data-handle="#th-termsLabel"></div></div>');

        HistoryList.init();
        THDomainManager.init();
        THTermManager.init();
        THSearch.init();
        THFilterManager.init();
    }

    self.onAttached = function(){
    }

    self.populateTopbar = function(bar){
        var dateBox = THDateBoxController.getDateBox();
        bar.append(dateBox);

        var searchBox = $('<input type="search" id="th-searchBox" class="m-topsearch" />');
        bar.append(searchBox);
    }

    self.tabImage = function(){
        return "images/relief/traditional.png";
    }

    self.titleIcon = function(){
        return "images/large/traditional.png";
    }

})();

