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
    }
})();

