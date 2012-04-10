include_("Collapsable");
style("timemarks/controls.css");

var TimeMarks = new (function _TimeMarks(){
    var self = this;

    self.init = function(){
        Master.addTab("timemarks", self, "TimeMarks", "timemarks/view.html#timemarks");
    }

    self.onCreate = function(){
        var bar = Master.createSidebar("timemarks");
        bar.attr("id", "t-leftSidebar");
        bar.append('<div class="sidebarGroup"><div class="sidebarLabel">Content</div><div id="tm-contentFilters" class="collapse"></div></div>');
        //$.Collapsable(".view_Collapsable");
        var contentHandle = $("#tm-contentFilters").parent().find(".sidebarLabel");
        $("#tm-contentFilters").collapsable("create", {handle: contentHandle, indicator: true});

        database.open();
        getAllTimeMarks();
    }

    self.onAttached = function(){
    }

    self.populateTopbar = function(bar){
        // no topbar
    }

    self.titleIcon = function(){
        return "images/large/timemarks2.png";
    }
})();

