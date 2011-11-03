var TraditionalHistory = {};

(function(){
    var m = TraditionalHistory;

    m.onAttached = function(){
        getAllTimeMarks();
        getUsersHistory();
        initView();
    }

    m.populateTopbar = function(bar){
    }

    m.tabImage = function(){
        return "images/tab_history.png";
    }

    m.titleIcon = function(){
        return "images/titleicon_history.png";
    }

    // initialization
    if(Master){
        Master.addTab("traditionalhistory", m, "History", "traditional/view.html#history");
        var bar = Master.createSidebar("traditionalhistory");
        bar.attr("id", "h-leftSidebar");
        bar.find(".m-sidebarTitle span").text("Traditional History");
        bar.append('<div id="navbar-container"><div id="navbar_filters"><div id="navbar_filters_timeMarks" class="navbar_filter"></div><div id="navbar_filters_traditionalHistory" class="navbar_filter"></div></div></div><div class="sidebarLabel">Filters</div><div id="historyFilters" class="collapse"></div>');
        THSidebar.init();
    }
})();

