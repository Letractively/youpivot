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

//http://www.webtoolkit.info/javascript-utf8.html
function encode(string) {
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";

	for (var n = 0; n < string.length; n++) {

		var c = string.charCodeAt(n);

		if (c < 128) {
			utftext += String.fromCharCode(c);
		}
		else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		}
		else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}

	}

	return utftext;
}
