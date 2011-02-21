var DomainManager = {};

(function(){
	var master = DomainManager;

	master.addDomain = function(url, name){
		var img = IconFactory.createFavicon(url, name);
		$("#contentFilters").append(img.addClass("favicon"));
	}

	master.clearDomains = function(){
		$("#contentFilters").html("");
	}

	master.addCustomDomain = function(icon, title){
		var img = IconFactory.createIcon(icon, title);
		$("#contentFilters").append(img.addClass("favicon"));
	}
})();
