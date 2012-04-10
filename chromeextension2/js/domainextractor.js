var DomainExtractor = new (function _DomainExtractor(){
    var self = this;

	self.getName = function(url){
		var domain = url.split("://")[1];
		domain = domain.replace("www.", "");
		domain = domain.split("/")[0];
		return domain;
	}
})();
