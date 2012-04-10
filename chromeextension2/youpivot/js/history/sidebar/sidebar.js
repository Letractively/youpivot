include_("SortManager");
include_("TermManager");
include_("DomainManager");
include_("StreamManager");
include_("DatePicker");

var SidebarManager = new (function _SidebarManager(){
    var self = this;

    self.init = function(){
        $.Collapsable(".view_Collapsable");
        SortManager.init();
        TermManager.init();
        DomainManager.init();
        StreamManager.init();
        DatePicker.init();
    }
})();
