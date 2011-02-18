var TermManager = {};

(function(){
	var master = TermManager;

	var terms = new Array();
	master.addTerm = function(text, rating){
		terms[terms.length] = {text: text, rating: rating};
		terms.sort(sortFunction);
		master.displayTerms();
	}
	master.displayTerms = function(){
		$("#terms").html("");
		for(var i in terms){
			if(i>17) break;
			displayTerm(terms[i].text, i);
		}
	}
	//return an exponentially decaying number (0-1)
	function decay(num, rate){
		//exponential decay
		return Math.pow(2, num*-rate);
	}
	function displayTerm(text, order){
		var term = $("<div class='term'></div>").text(text);
		term.css("font-size", 20*decay(order, 0.05)+"px");
		term.css("opacity", decay(order, 0.15));
		$("#terms").append(term);
	}
	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	master.clearTerms = function(){
		$("#terms").html("");
	}
})();
