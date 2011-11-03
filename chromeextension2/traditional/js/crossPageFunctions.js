var uniqeHashForFilterName = "uniqueHash";



function getUniqueString(url, favIconUrl,title){
	var extractedDomain = url.split("//")[1].split("/")[0];
	
	var favIconImg = new Image();
	favIconImg.src = favIconUrl;
	
	var favIconImg_base64 = getBase64Image(favIconImg)
	
	
	return getUniqueString_(url, favIconUrl,title,favIconImg_base64,extractedDomain);
}

function getUniqueString_(url, favIconUrl,title,favIconImg_base64,extractedDomain){
	
	var uniqueString = hex_md5(extractedDomain+" - "+favIconImg_base64).toLowerCase();
	
	return uniqueString;
}




function filterClicked(dataArray){
	var dataArrayData = dataArray.data;
	var title = dataArrayData[0];
	var uniqueHash = dataArrayData[1];
	var filterTargetDivTitle = dataArrayData[2];
	var filterTargetDivTitleClass = dataArrayData[3];
	var filterArray = dataArrayData[4];
	var activeFilterDiv = dataArrayData[5];
	var favIconUrl = dataArrayData[6];

	var index = $.inArray(uniqueHash, filterArray);
	if(index==-1){
		filterArray.push(uniqueHash);
		
		var div_activeFavIconFilter =createFilterIcon(title,favIconUrl,uniqueHash,"activeKey_");
		
		document.getElementById(activeFilterDiv).appendChild(div_activeFavIconFilter);
		
		$('#activeKey_'+uniqueHash).click(new Array(title,uniqueHash,filterTargetDivTitle,filterTargetDivTitleClass,filterArray,activeFilterDiv,favIconUrl),filterClicked);
		
	}else{
		filterArray.splice(index,1);
		
		$("#activeKey_"+uniqueHash).remove();
	}
	
	reFilter(filterTargetDivTitle,filterTargetDivTitleClass,filterArray);
	
}

function reFilter(filterTargetDivTitle,filterTargetDivTitleClass,filterArray){
	
	var children =  $('#'+filterTargetDivTitle).find('.'+filterTargetDivTitleClass); //this is hardCoded - may need to change :)
	
	children.each(function(){
		var kid = $(this);
		
		var showed = false;
		kid.hide();
		
		for(var i = 0; (i < filterArray.length) && !showed; i++) {
			if(kid.attr('uniquehash') == filterArray[i]){
				kid.show();
				showed = true;
			}
		}
		if(filterArray.length == 0){
			kid.show();
		}
		
	});
	
	//console.log("hello "+children.size()+" of "+filterArray.length);
}

function createFilterList(hashtable,filterDivTitle,filterTargetDivTitle,target_filterList,targetElementClass,activeFilterDiv){
    THFilterManager.clearDomains(false);
	target_filterList = new Array();

	var keyArray = hashtable.getKeys();
	
	for(var i=0; i<keyArray.length; i++) {
		var key = keyArray[i];

		var favIconArray = hashtable.getItem(key);

        var data = [
            favIconArray[0],
            key,
            filterTargetDivTitle,
            targetElementClass,
            target_filterList,
            activeFilterDiv,
            favIconArray[1]
        ]
		
        THFilterManager.addDomain(favIconArray[1], favIconArray[0], data);

		//var div_favIconFilter = createFilterIcon(favIconArray[0],favIconArray[1],key,"key_");
		
		//document.getElementById(filterDivTitle).appendChild(div_favIconFilter);
		
	}
    THFilterManager.display();

}
/*

function createFilterList(hashtable,filterDivTitle,filterTargetDivTitle,target_filterList,targetElementClass,activeFilterDiv){
	$("#"+filterDivTitle).empty(); //clear out old data
	target_filterList = new Array();
	
	var div_favIconFilterTitle = document.createElement('div');
	div_favIconFilterTitle.appendChild(document.createTextNode("Filter by Source:"));
	div_favIconFilterTitle.setAttribute('class','navBarTitle');
	document.getElementById(filterDivTitle).appendChild(div_favIconFilterTitle);
	
	var keyArray = hashtable.getKeys();
	
	for(var i=0; i<keyArray.length; i++) {
		var key = keyArray[i];
		
		var favIconArray = hashtable.getItem(key);

		var div_favIconFilter = createFilterIcon(favIconArray[0],favIconArray[1],key,"key_");
		
		
		
		document.getElementById(filterDivTitle).appendChild(div_favIconFilter);
		
		$('#key_'+key).click(new Array(favIconArray[0],key,filterTargetDivTitle,targetElementClass,target_filterList,activeFilterDiv,favIconArray[1]),filterClicked);
	}
	
}*/

function createFilterIcon(title,faviconURL,key,idPreText){
	var div_favIconFilter = document.createElement('div');
	div_favIconFilter.setAttribute('class','faviconFilter');
	div_favIconFilter.setAttribute('style',"background-image:url('"+faviconURL+"')");
	div_favIconFilter.setAttribute('title',title);
	div_favIconFilter.setAttribute('id',idPreText+key);
	
	return div_favIconFilter
}

//var myHash = new Hash('one', 1, 'two', 2, 'three', 3);
function Hash()
{
	this.length = 0;
	this.items = new Array();
	for (var i = 0; i < arguments.length; i += 2) {
		if (typeof(arguments[i + 1]) != 'undefined') {
			this.items[arguments[i]] = arguments[i + 1];
			this.length++;
		}
	}
	
	this.getKeys = function(){
		var keyArray = new Array();
		for (var key in this.items){
			keyArray.push(key);
		}
		return keyArray;
	}
   
	this.removeItem = function(in_key)
	{
		var tmp_previous;
		if (typeof(this.items[in_key]) != 'undefined') {
			this.length--;
			var tmp_previous = this.items[in_key];
			delete this.items[in_key];
		}
	   
		return tmp_previous;
	}

	this.getItem = function(in_key) {
		return this.items[in_key];
	}

	this.setItem = function(in_key, in_value)
	{
		var tmp_previous;
		if (typeof(in_value) != 'undefined') {
			if (typeof(this.items[in_key]) == 'undefined') {
				this.length++;
			}
			else {
				tmp_previous = this.items[in_key];
			}

			this.items[in_key] = in_value;
		}
	   
		return tmp_previous;
	}

	this.hasItem = function(in_key)
	{
		return typeof(this.items[in_key]) != 'undefined';
	}

	this.clear = function()
	{
		for (var i in this.items) {
			delete this.items[i];
		}

		this.length = 0;
	}
}
