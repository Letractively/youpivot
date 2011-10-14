var YouPivot = {};

(function(){
    var m = YouPivot;

    m.onAttached = function(){
    }

    m.populateTopbar = function(bar){
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

