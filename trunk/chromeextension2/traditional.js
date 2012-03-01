style("/traditional/css/controls.css");

var TraditionalHistory = new (function _TraditionalHistory(){
    var self = this;

    self.onAttached = function(){
    }

    self.populateTopbar = function(bar){
        O_O.include("/traditional/js/datebox.js");
        var dateBox = THDateBoxController.createDateBox();
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

    // initialization
    if(Master){
        Master.addTab("traditionalhistory", self, "History", "traditional/history.html");
        var bar = Master.createSidebar("traditionalhistory");
        bar.attr("id", "h-leftSidebar");
        bar.find(".m-sidebarTitle span").text("Traditional History");
        bar.append('<div class="sidebarGroup"><div class="sidebarLabel" id="th-contentLabel">Content</div><div id="th-contentFilters" class="collapse view_Collapsable" data-indicator="true" data-handle="#th-contentLabel"></div></div>');
        bar.append('<div class="sidebarGroup"><div class="sidebarLabel" id="th-termsLabel">Terms</div><div id="th-termFilters" class="collapse view_Collapsable" data-indicator="true" data-handle="#th-termsLabel"></div></div>');
    }
})();

