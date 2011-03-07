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
			if(term.rating+1>best) best = term.rating+1;
		}
	}
	m.display = function(){
		terms.sort(sortFunction);
		$("#terms").html("");
		for(var i in terms){
			if(i>17) break;
			displayTerm(terms[i].text, terms[i].rating);
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

	var best = 1; //dummy. Should be overwritten before first call. 

	function displayTerm(text, rating){
		var term = $("<div class='term'></div>").text(text);
		term.css("font-size", 20*Helper.decay(rating, 1, best)+"px");
		term.css("opacity", Helper.decay(rating, 1, best));
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
		best = 1;
		m.display();
	}
})();
