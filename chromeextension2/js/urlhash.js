// Helper class for detecting and managing changes in the URL hash (stuff after #) 

var URLHash = new (function _URLHash(){
    var self = this;

    var hashTable = {};
    var delegateFunctions = {};

    self.onHashValueChange = function(hashKey, func){
        delegateFunctions[hashKey] = func;
    }

    self.getHashValue = function(hashKey){
        return hashTable[hashKey];
    }

    self.setHash = function(key, value){
        hashTable[key] = value;
        generateURL();
    }

	//listen for hash change
	$(window).bind("hashchange", function(){
		var hash = location.hash.substr(1); //substring 1 to remove the # sign
		var pairs = hash.split("&");
		var obj = [];
		for(var i in pairs){
			obj[i] = pairs[i].split("=");
			runHash(obj[i]);
		}
	});

    $(window).trigger("hashchange");

	function runHash(pair){
        updateHashTable(pair[0], pair[1]);
	}

    function updateHashTable(key, value){
        if(hashTable[key] !== value){
            hashTable[key] = value;
            callDelegate(key, [value]);
        }
    }

    function callDelegate(key, paramList){
        var func = delegateFunctions[key];
        if(typeof func == "function")
            func.apply(this, paramList);
    }

    function generateURL(){
        var arr = [];
        var k=0;
        for(var i in hashTable){
            arr[k++] = i+"="+hashTable[i];
        }
        var string = arr.join("&");
        location.href = "#" + string;
    }

	/*$(window).bind("itemsLoaded", function(){
		//invoke the window hash change to parse hash when started
		$(window).trigger("hashchange");
	});*/
})();
