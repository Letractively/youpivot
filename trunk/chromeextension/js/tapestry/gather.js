/**
 * Contents in this file are gathered from the old version of YouPivot
 * (Tapestry) and should be cleaned up before release
 *
 **/


/*** Hash object
 * A data structure for storing information
 ****/
function _Hash()
{
	this.length = 0;
	this.items = new Array();
	this.addUnderscore = true;

	for(var i=0; i< arguments.length; i++){
		if(i==0 && arguments[i]==false)
			this.addUnderscore = false;
	}

	function makeLocalID(tabId){
		if(this.addUnderscore)
			return "_"+tabId;
		else
			return ""+tabId;
	}

	this.getArray = function(){
		return this.items;
	}

	this.removeItem = function(in_key)
	{
		var tmp_previous;
		if (typeof(this.items[makeLocalID(in_key)]) != 'undefined') {
			this.length--;
			var tmp_previous = this.items[makeLocalID(in_key)];
			delete this.items[makeLocalID(in_key)];
		}

		return tmp_previous;
	}

	this.getItem = function(in_key) {
		return this.items[makeLocalID(in_key)];
	}

	this.setItem = function(in_key, in_value)
	{
		var tmp_previous;
		if (typeof(in_value) != 'undefined') {
			if (typeof(this.items[makeLocalID(in_key)]) == 'undefined') {
				this.length++;
			}
			else {
				tmp_previous = this.items[makeLocalID(in_key)];
			}

			this.items[makeLocalID(in_key)] = in_value;
		}

		return tmp_previous;
	}

	this.hasItem = function(in_key)
	{
		return typeof(this.items[makeLocalID(in_key)]) != 'undefined';
	}

	this.clear = function()
	{
		for (var i in this.items) {
			delete this.items[i];
		}

		this.length = 0;
	}
}
/*** end Hash object ***/

/*** used in actual importance code ***/
function validPageToLog(url){
	if(url.indexOf('chrome://')>=0)
		return false;
	if(url.indexOf('chrome-extension://')>=0)
		return false;
	if(localStorage["serverUrl"])
	  if(localStorage["serverUrl"] != "")
		if(localStorage["serverUrl"].length > 0)
		  if(url.indexOf(localStorage["serverUrl"])>=0)
			return false;
	
	return true;
}
/*** end valid page to log ****/
