var IconFactory = {};

(function(){
	var m = IconFactory;

	m.createFavicon = function(url, name){
		if(!name) name = url;
		return this.createIcon(getFavicon(url), name);
	}

	function getFavicon(url){
		return "chrome://favicon/"+url;
	}

	m.createIcon = function(src, name){
		if(!name) name = src;
		var img = $("<img src='"+src+"' title='"+name+"' class='favicon' />");
		return img;
	}
})();
