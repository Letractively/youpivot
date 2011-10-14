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

    m.tabImage = function(){
        return "images/tab_timemark.png";
    }

    m.titleIcon = function(){
        return "images/titleicon_timemark.png";
    }

    // initialization
    if(Master){
        Master.addTab("timemarks", m, "TimeMarks", "timemarks/view.html#timemarks");
        var bar = Master.createSidebar("timemarks");
    }
})();

