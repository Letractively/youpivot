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
			if(terms[i].text.toLowerCase() == term.toLowerCase()){
				return i;
			}
		}
		return -1;
	}

	var best = 1; //dummy. Should be overwritten before first call. 

	function displayTerm(text, rating){
		var anchor = $("<a href='' class='termAnchor'></a>").text(text);
		anchor.attr("href", "javascript: filter");
		anchor.css("font-size", 20*Helper.decay(rating, 1, best)+"px");
		anchor.css("opacity", Helper.decay(rating, 1, best));
		anchor.click(function(){
			FilterManager.addFilter("name", text, text);
			includeFilter(this);
			return false;
		});
		anchor.data("title", text);
		var term = $("<div class='term'></div>").append(anchor);
		$("#terms").append(term);
		anchor.contextMenu("term_menu", {
			"Include this keyword": {
				click: includeFilter
			},
			"Exclude this keyword": {
				click: excludeFilter
			}
		}, 
		{ title: text });

		function includeFilter(obj){
			FilterManager.addFilter("name", $(obj).data("title"), $(obj).data("title"));
		}
		function excludeFilter(obj){
			FilterManager.addOutcast("name", $(obj).data("title"), $(obj).data("title"));
		}
	}
	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	m.clearTerms = function(retainOrder){
		if(!retainOrder){
			terms = [];
		}else{
			for(var i in terms){
				terms[i].rating = 0;
			}
		}
		best = 1;
		m.display();
	}
})();
