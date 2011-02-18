var IconFactory = {};

(function(){
	var master = IconFactory;

	master.createFavicon = function(url, name){
		if(!name) name = url;
		return this.createIcon(getFavicon(url), name);
	}

	function getFavicon(url){
		return "chrome://favicon/"+url;
	}

	master.createIcon = function(src, name){
		if(!name) name = src;
		var img = $("<img src='"+src+"' title='"+name+"' />");
		return img;
	}
})();
