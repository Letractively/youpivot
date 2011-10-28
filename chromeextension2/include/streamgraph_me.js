// The script to process the raw data and generate a nice-looking stream graph. 
// Not involved in actual drawing of the graph, but rather things like sorting or stacking. 
// There are more methods here than needed, some of them are alternative sorting methods, set in the SETTINGS object. 
// By Jason Sundram 5/2010, based on Byron & Wattenberg's Streamgraph Generator.
// To make a streamgraph, you need: Data, a Sort Order, a Layout, and Colors.


/* DATA */

function Layer(name, color, data)
{
    // don't do integrity check here
    /*for (var i = 0; i < size.length; i++)
        if (size[i] < 0)
            throw("No negative values allowed");*/
    
    this.name = name;
    this.color = color;
    this.size = data;
    this.sum = 0;
    this.volatility = 0;
    this.onset = -1;
    this.end = -1;
    
    for (var i in data)
    {
        this.sum += data[i];

        // unused information
        if (data[i]>0)
        {
            if (this.onset == -1)
                this.onset = i;
            else
                this.end = i;
        }
        
        if (i > 0)
            this.volatility = _max(this.volatility, Math.abs(data[i] - data[i-1]));
    }
    // If we didn't set the end, we only had one data point. So, set it now.
    // Also, might consider moving onset up one, so that we have 3 data points to draw a curve. 
    //if (this.end == -1)
    //    this.end = this.onset + 1;//this.onset = this.onset == 0 ? 0 : this.onset - 1;
}

function _max(a, b){
    return (a>b) ? a : b;
}

// Expect data to be a 2D array.
/*function DataSource(data, labels)
{
    this.data = data;
    this.labels = labels;
}

DataSource.prototype = {
    
    make : function(numLayers, sizeArrayLength)
    {
        layers = [];
        if (this.data[0].length < sizeArrayLength || this.data.length < numLayers)
        {
            console.log(this.data[0].length , " < " , sizeArrayLength , " or " , this.data.length , " < " , numLayers);
            throw("Wrong data size:");
        }
        
        for (var col = 0; col < numLayers; col++)
        {
            var name = this.labels[col];
            layers.push(new Layer(name, this.data[col]));
        }
        return layers;
    }
};*/

/* SORTING */
/**
 * Creates a 'top' and 'bottom' collection.
 * Iterating through the previously sorted list of layers, place each layer
 * in whichever collection has less total mass, arriving at an evenly
 * weighted graph. Reassemble such that the layers that appeared earliest
 * end up in the 'center' of the graph.
**/
function orderToOutside(layers)
{
    var topList = [];
    var topSum = 0;
    var botList = [];
    var botSum = 0;
    
    // Partition top and bottom.
    for (var i = 0; i < layers.length; i++)
    {
        var layer = layers[i];
        if (topSum < botSum)
        {
            topList.push(layer);
            topSum += layer.sum;
        }
        else
        {
            botList.push(layer);
            botSum += layer.sum;
        }
    }
    
    // Reassemble
    var ordered = [];
    for (var i = 0; i < botList.length; i++)
        ordered.unshift(botList[i]);
    
    for (var i = 0; i < topList.length; i++)
        ordered.push(topList[i]);
    
    return ordered;
}

// Do no sorting.
function NoneSort(layers)
{
    return orderToOutside(layers);
}

// Sorts by onset, and orders to the outsides of the graph.
function LateOnsetSort(layers)
{
    layers.sort(function(p,q){return p.onset - q.onset;});
    return orderToOutside(layers);
}

function VolatilitySort(layers)
{
    layers.sort(function(p,q){return (p.volatility - q.volatility);});
    return orderToOutside(layers);
}

// Opposite of VolatilitySort
function InverseVolatilitySort(layers)
{
    layers.sort(function(p,q){return (q.volatility - p.volatility);}); 
    return orderToOutside(layers);
}

/* LAYOUT */

function stackOnBaseline(layers, baseline)
{
    for (var i = 0; i < layers.length; i++)
    {
        var layer = layers[i];
        layer.yBottom = baseline.slice(0);
        for(var j in layer.size){
            if(baseline[j] !== undefined)
                baseline[j] -= layer.size[j];
        }
        layer.yTop = baseline.slice(0);
    }
}

// Alternative to StreamLayout. Some drawbacks, but much faster.
/*function MinimizedWiggleLayout(layers)
{
    var n = layers[0].size.length;
    var m = layers.length;
    
    baseline = [];
    for (var i = 0; i < n; i++)
    {
        var b = 0;
        for (var j = 0; j < m; j++)
            b += (m - j - 0.5) * layers[j].size[i];
        
        baseline.push( b / m);
    }
    
    stackOnBaseline(layers, baseline);
}

function StackLayout(layers)
{
    var n = layers[0].size.length;
    baseline = [];
    for (var i = 0; i < n; i++)
        baseline[i] = 0;
    
    stackOnBaseline(layers, baseline);
}

// Slow on large datasets.
function StreamLayout(layers)
{
    var n = layers[0].size.length;
    var m = layers.length;
    var moveUp, increase, belowSize;
    var center = [];
    var baseline = [];
    
    for (var i = 0; i < n; i++)
    {
        center[i] = (i === 0) ? 0 : center[i-1]; // Let the center roll.
        var totalSize = 0;
        for (var j = 0; j < m; j++)
            totalSize += layers[j].size[i];
            
        // Account for the change of every layer to offset the center point.
        for (var j = 0; j < m; j++)
        {
            var size = layers[j].size[i];
            if (i === 0)
            {
                increase = size;
                moveUp = 0.5;
            }
            else
            {
                belowSize = 0.5 * size;
                for (var k = j + 1; k < m; k++)
                    belowSize += layers[k].size[i];
                increase = size - layers[j].size[i-1];
                moveUp = (totalSize == 0) ? 0 : (belowSize / totalSize);
            }
            
            center[i] += (moveUp - 0.5) * increase;
        }
        
        // Set baseline to the bottom edge according to the center line
        baseline[i] = center[i] + 0.5 * totalSize;
    }
    
    stackOnBaseline(layers, baseline);
}*/

// Layout used by the authors of the ThemeRiver paper. Perfectly symmetrical.
function ThemeRiverLayout(layers)
{
    var baseline = [];
    //console.log(layers); // FIXME

    for (var i=0; i<758; i++){
        var b = 0;
        for (var j = 0; j < layers.length; j++){
            if(layers[j].size[i]){
                b += layers[j].size[i];
            }
        }
        
        // The baseline is 1/2 of the total height at any point.
        if(b > 0){
            baseline[i] = b * 0.5;
            //console.log(baseline[i], baseline);
        }
    }
    //console.log(baseline);
    
    stackOnBaseline(layers, baseline);
}

/* COLORS */

function lerp(value1, value2, amt) 
{
    return ((value2 - value1) * amt) + value1;
}

function RandomColorPicker(layers)
{
    for (var i = 0; i < layers.length; i++)
    {
        var h = lerp(0.6, 0.65, Math.random());
        var s = lerp(0.2, 0.25, Math.random());
        var b = lerp(0.4, 0.95, Math.random());
        layers[i].hsb = [h, s, b]; // Let the sketch worry about HSB -> RGB conversion.
    }
}

// Like RandomColorPicker, but with more variation betwen colors
function NiceRandomColorPicker(layers)
{
    for (var i = 0; i < layers.length; i++)
    {
        var h = lerp(0.2, 0.65, Math.random()); // Hue changes make a big difference.
        var s = lerp(0.2, 0.25, Math.random());
        var b = lerp(0.4, 0.95, Math.random());
        layers[i].hsb = [h, s, b]; // Let the sketch worry about HSB -> RGB conversion.
    }
}

// Source is an object that supports width, height and pixels (in RGB order). 
/*function LastFmColorPicker(layers, source)
{
    var maxSum = 0;
    var non_zero_offsets = false;
    for (var j = 0; j < layers.length; j++)
    {
        maxSum = Math.max(maxSum, layers[j].sum);
        if (0 < layers[j].onset)
            non_zero_offsets = true;
    }
    
    // keep value in the interval [start, end)
    function constrain(x, start, end)
    {
        if (x < start)
            return start;
        if (end <= x)
            return end-1;
        return x;
    }
    
    function get(g1, g2)
    {
        var x = constrain(Math.floor(g1 * source.width), 0, source.width);
        var y = constrain(Math.floor(g2 * source.height), 0, source.height);
        color = source.pixels[x + y * source.width];
        return color;
    }
    
    for (var i = 0; i < layers.length; i++)
    {
        var layer = layers[i];
        
        var normalizedOnset = layer.onset / layer.size.length;
        var normalizedSum = layer.sum / maxSum;
        var shapedSum = 1.0 - Math.sqrt(normalizedSum);
        
        if (non_zero_offsets)
            layer.rgb = get(normalizedOnset, shapedSum);
        else
            layer.rgb = get(normalizedSum, shapedSum); // Cheat to make colors interesting.
    }
}*/

// Rect object code by Jason Sundram, complementary to the streamgraph.js file. 
// This is required for the generation of streamgraphs. 
// By Jason Sundram 5/2010.
function Rect(l, t, w, h) 
{
    this.left = l;
    this.top = t;
    this.width = w;
    this.height = h;
}


Rect.prototype = {
    contains: function (x, y) 
    {
        return ((this.left <= x) && (x <= this.left + this.width) && (this.top <= y) && (y <= this.top + this.height));
    },
    
    bottom: function()
    {
        return this.top + this.height;
    },
    
    right: function()
    {
        return this.left + this.width;
    }
    
};
