var UserManager = new (function _UserManager(){
	var self = this;
	var userId = -1;

	self.getId = function(){
		return userId;
	}

	self.login = function(){
		userId = "e34c5ee0d846e882ae1014294b000990";
	}
})();

$(function(){
	//FIXME debug, pretend to be logged in
	UserManager.login();
});
