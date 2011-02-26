var UserManager = {};

$(function(){
	//debug, pretend to be logged in
	UserManager.login();
});

(function(){
	var m = UserManager;
	var userId = -1;

	m.getId = function(){
		return userId;
	}

	m.login = function(){
		userId = 8080;
	}
})();
