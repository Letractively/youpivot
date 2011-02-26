var TermManager = {};

(function(){
	var m = TermManager;

	var terms = new Array();
	//add an array of terms
	m.addTerms = function(texts){
		for(var i in texts){
			m.addTerm(texts[i]);
		}
	}
	m.addTerm = function(text){
		var index = getTermIndex(text);
		if(index==-1){
			terms[terms.length] = {text: text, rating: 1};
		}else{
			var term = terms[index];
			terms[index] = {text: text, rating: term.rating+1};
		}
		terms.sort(sortFunction);
		m.display();
	}
	m.display = function(){
		$("#terms").html("");
		for(var i in terms){
			if(i>17) break;
			displayTerm(terms[i].text, i);
		}
	}
	function getTermIndex(term){
		for(var i in terms){
			if(terms[i].text == term){
				return i;
			}
		}
		return -1;
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
		term.click(function(){
			FilterManager.addFilter("name", text, text);
		});
		$("#terms").append(term);
	}
	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	m.clearTerms = function(){
		terms = new Array();
		m.displayTerms();
	}
})();
