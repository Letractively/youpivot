var PivotManager = {};

(function(){
	var m = PivotManager;

	m.pivot = function(time){
		time = Math.floor(time/1000);
		Connector.send("get", {pivottime: time}, function(data){
			var obj = JSON.parse(data);
			var arr = createItemsArray(obj);
			console.log(arr);
			ItemManager.clear();
			ItemManager.addItems(arr);
			GraphManager.draw();
		});
	}

	function createItemsArray(obj){
		var output = [];
		for(var i in obj.rows){
			output[i] = translateItem(obj.rows[i].value);
		}
		return output;
	}

	//translate the item from "server-side" language to "client side" language
	function translateItem(server){
		var output = {};
		output.startTime = server.starttime*1000;
		output.endTime = server.endtime*1000;
		output.title = server.title;
		output.url = server.url;
		output.keywords = [server.keyword];
		output.domain = $.extend({}, debugDomain);
		output.domain.favUrl = server.favicon;
		return output;
	}
})();

var debugDomain = {color: "#808000", favUrl: "http://www.favicon.cc/favicon/618/110/favicon.ico", name: "debug.me"};
