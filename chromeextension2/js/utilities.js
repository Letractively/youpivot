var Utilities = new (function _Utilities(){
    var self = this;
    
	self.htmlEntities = function(string){
		return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");		
	}

	//return an exponentially decaying number (0,1]
	self.decay = function(num, rate, best){
		//exponential decay
		return Math.log((num+1)/rate)/Math.log((best+1)/rate);
		//+1 to prevent the value actually going to 0
	}

})();
