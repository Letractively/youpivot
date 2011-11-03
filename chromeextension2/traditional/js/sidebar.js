include("js/views/collapsable.js");
var THSidebar = {};

(function(){
	var m = THSidebar;

    m.init = function(){
        var historyHandle = $("#historyFilters").prev();
        $("#historyFilters").collapsable("create", {handle: historyHandle, indicator: true});
    }
})();
