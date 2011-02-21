var TableManager = {};

(function(){
	var m = TableManager;

	m.addItem = function(date, name, color, url, favUrl){
		var obj = {date: date, name: name, color: color, url: url, favUrl: favUrl};
		$("#textContent").addItem(obj);
	}

	m.clearItems = function(){
		$("#textContent").html("");
	}
})()
