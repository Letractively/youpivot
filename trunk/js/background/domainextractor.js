var DomainExtractor = {};

(function(){
	var m = DomainExtractor;

	m.getName = function(url){
		var domain = url.split("://")[1];
		domain = domain.replace("www.", "");
		domain = domain.split("/")[0];
		return domain;
	}
})();
