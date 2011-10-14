var Options = {};

(function(){
    var m = Options;

    m.onAttached = function(){
    }

    m.populateTopbar = function(bar){
        // no topbar
    }

    m.tabImage = function(){
        return "images/tab_settings.png";
    }

    m.titleIcon = function(){
        return "images/titleicon_settings.png";
    }

    // initialization
    if(Master){
        Master.addTab("options", m, "Settings", "options/options.html");
        Master.changeTabHandle("options", $("#m-settings"));
    }
})();

