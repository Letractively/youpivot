var UserManager = {};

$(function(){
	//FIXME debug, pretend to be logged in
	UserManager.login();
});

(function(){
	var m = UserManager;
	var userId = -1;

	m.getId = function(){
		return userId;
	}

	m.login = function(){
		userId = "e34c5ee0d846e882ae1014294b000990";
	}
})();
