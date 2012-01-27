style("/traditional/css/controls.css");

var TraditionalHistory = new (function _TraditionalHistory(){
    var self = this;

    self.onAttached = function(){
    }

    self.populateTopbar = function(bar){
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
        bar.append('<div class="sidebarGroup"><div class="sidebarLabel">Content</div><div id="th-contentFilters" class="collapse"></div></div>');
        include("js/views/collapsable.js");
        var contentHandle = $("#th-contentFilters").parent().find(".sidebarLabel");
        $("#th-contentFilters").collapsable("create", {handle: contentHandle, indicator: true});
    }
})();

