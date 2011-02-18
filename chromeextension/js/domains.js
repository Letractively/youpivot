var DomainManager = {};

(function(){
	var master = DomainManager;

	master.addDomain = function(url){
		var img = IconFactory.createFavicon(url, url);
		$("#favicons").append(img.addClass("favicon"));
	}

	master.clearDomains = function(){
		$("#favicons").html("");
	}

	master.addCustomDomain = function(icon, title){
		var img = IconFactory.createIcon(icon, title);
		$("#favicons").append(img.addClass("favicon"));
	}
})();
