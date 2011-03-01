var PivotManager = {};

(function(){
	var m = PivotManager;

	m.pivot = function(time){
		time = Math.floor(time/1000);
		Connector.send("get", {pivottime: time}, function(data){
			console.log(data);
		});
	}
})();
