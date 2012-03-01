include("/js/views/collapsable.js");

var SidebarManager = new (function _SidebarManager(){
    var self = this;

    self.init = function(){
        /*var streamHandle = $("#streamFilters").prev();
        $("#streamFilters").collapsable("create", {handle: streamHandle, indicator: true});

        var contentHandle = $("#contentFilters").parent().find(".sidebarLabel");
        $("#contentFilters").collapsable("create", {handle: contentHandle, indicator: true});

        var termHandle = $("#terms").parent().find(".sidebarLabel");
        $("#terms").collapsable("create", {handle: termHandle, indicator: true});

        var sortHandle = $("#sortItems").parent().find(".sidebarLabel");
        $("#sortItems").collapsable("create", {handle: sortHandle, indicator: true});*/

        //$.Collapsable(".view_Collapsable");
        SortManager.init();
    }
})();
