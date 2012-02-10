style("timemarks/controls.css");

var TimeMarks = {};

(function(){
    var m = TimeMarks;

    m.onAttached = function(){
        getAllTimeMarks();
        initView();
    }

    m.populateTopbar = function(bar){
        // no topbar
    }

    m.titleIcon = function(){
        return "images/large/timemarks2.png";
    }

    // initialization
    if(Master){
        Master.addTab("timemarks", m, "TimeMarks", "timemarks/view.html#timemarks");
        var bar = Master.createSidebar("timemarks");
        bar.attr("id", "t-leftSidebar");
        bar.append('<div class="sidebarGroup"><div class="sidebarLabel">Content</div><div id="tm-contentFilters" class="collapse"></div></div>');
        include("js/views/collapsable.js");
        var contentHandle = $("#tm-contentFilters").parent().find(".sidebarLabel");
        $("#tm-contentFilters").collapsable("create", {handle: contentHandle, indicator: true});
    }
})();

