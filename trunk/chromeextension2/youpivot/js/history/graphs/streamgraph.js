include("js/color.js");

var StreamGraph = {};

/***************** API *********************
  
 draw (data, offset, scale)
 changeColor(id, color)
 setScale(offset, cap, redraw)
 redraw(StreamGraph.DrawModes mode)
 onMouseEnterLayer(function(id) {})
 onMouseLeaveLayer(function(id) {})
 onMouseClickLayer(function(id) {})

 StreamGraphDrawModes = { all, scale, color }

********************************************/

(function(){
    var m = StreamGraph;
    var pjs;

    m.DrawModes = {
        all : 0,
        scale : 1,
        color : 2
    };
    var DrawModes = m.DrawModes;
    var drawMode = DrawModes.all;
    var settings = {
        w: 680,
        h: 150,
        sort: VolatilitySort,
        layout: ThemeRiverLayout,
        curve: true,
        background: [0,0,0,0]
    };
    var layers = null;
    var layerTable = {};

    var startPoint = 0;
    var endPoint = -1;

    m.init = function(){
        initPJS();
    }

    function initPJS(){
        var canvas = document.getElementById("streamCanvas");
        pjs = new Processing(canvas, stream);
    }

    m.draw = function(data, offset, scale){
        processData(data);
        pjs.stream.setScale(offset, scale);
        pjs.stream.draw();
    }

    m.redraw = function(mode){
        drawMode = mode;
        pjs.redraw();
    }

    m.changeColor = function(id, color){
        pjs.stream.changeColor(id, color);
    }

    m.scale = function(offset, scale){
        pjs.stream.setScale(offset, scale);
        m.redraw(DrawModes.scale);
    }

    function processData(data){
        layers = createLayers(data);
    }

    function createLayers(data){
        layersArray = [];
        var numLayers = data.length;

        var ttt = new Date().getTime();

        for (var i = 0; i < numLayers; i++)
        {
            var array = expandDataArray(data[i].offset, data[i].array);
            layersArray.push(new Layer(data[i].id, data[i].color, array));
            //var dataArray = createDataArray(data[i].dataArray, data[i].startTime);
        }

        //console.log("time to create layers: ", new Date().getTime()-ttt);
        return layersArray;
    }

    function stream(P){
        // By Jason Sundram 5/2010, based on Byron & Wattenberg's Streamgraph Generator.
        // Translated into javascript by Maurice Lam

        // tell Processing.js to make the background transparent
        this.options.isTransparent = true;

        /*** external facing functions, wrapped in P.stream ***/

        P.stream = {};

        P.stream.draw = function(){
            drawMode = DrawModes.all;
            P.redraw();
        }

        P.stream.changeColor = function(id, color){
            var i = layerTable[id];
            // support both RGB array and hex color string
            if(typeof color == "string"){
                layers[i].color = Color.toRGBArray(color);
            }else{
                layers[i].color = color;
            }
            P.pushStyle();
            P.fill();
            P.noStroke();
            drawLayer(layers[i], layers[i].color, false, true);
            P.popStyle();
        }

        P.stream.setScale = function(offset, scale){
            if(layers.length == 0) return;
            if(offset<0 || offset+scale>1){
                console.log("offset:", offset, "scale:", scale);
                throw "Offset and scale out of bounds. ";
            }
            startPoint = Math.floor(offset*layers[0].size.length);
            endPoint = Math.ceil((offset+scale)*layers[0].size.length);
        }

        /*** end external facing functions ***/

        P.setup = function(){
            P.size(settings.w, settings.h);

            P.background.apply(this, settings.background); // background(0,0,0,0) -> transparent
            P.smooth();

            P.noLoop(); // This needs to be called last.
        }


        function createLayerTable(layers){
            for(var i in layers){
                layerTable[layers[i].name] = i;
            }
        }


        var m; // FIXME debug
        P.draw = function(){
                            //console.trace();

                            //console.log("cycle time: ", P.millis() - m); // FIXME debug
                            //m = P.millis(); // FIXME debug

            // don't draw if data is undefined
            if(!layers || layers.length == 0){
                P.background.apply(this, settings.background); // background(0,0,0,0); -> transparent
                return;
            }

            /* Set up screen geometry */
            if(drawMode == DrawModes.all){ //don't redo all the calculations if only changing color
                            //var ttt3 = P.millis(); // FIXME debug
                if (endPoint == -1){
                    endPoint = layers[0].size.length;
                }
                /* Calculate */
                // WARNING: this will change the order of the layers array, making it not the same as the source data
                var layer_sort = settings.sort;
                layers = layer_sort(layers);

                var layer_layout = settings.layout;
                layer_layout(layers);

                createLayerTable(layers);
                            //console.log("sort time: ", P.millis() - ttt3); // FIXME debug
            }


            if(drawMode == DrawModes.all || drawMode == DrawModes.scale){
                            //var ttt2 = P.millis(); // FIXME debug
                scaleLayers(layers, P.height + 10);
                            //console.log("scale time: ", P.millis() - ttt2);
            }

            /* Draw */
            var curve = settings.curve;
            drawLayers(layers, curve);

                            //console.log("total time to draw: ", P.millis() - m); // FIXME debug
        }

        function scaleLayers(layers, canvasHeight) 
        {
            // Figure out max and min values of layers.
            var lmin = layers[0].yTop[startPoint];
            var lmax = layers[0].yBottom[startPoint];

            var layersLength = layers.length;
            for (var i = startPoint; i < endPoint; i++)
            {
                lmin = _min(lmin, layers[layersLength-1].yTop[i]);
                lmax = _max(lmax, layers[0].yBottom[i]);
            }

                            //var maxi=0, maxj=0;
            if(lmax - lmin == 0) lmax = 1; // prevent division by 0

            // looks nicer if subtract canvasHeight by 20 (somehow)
            var scale = (canvasHeight-20) / (lmax - lmin);

            // give some bleed edge to make sure nice scaling
            var start = _max(startPoint - 2, 0);
            var end = _min(end + 2, 758);

            for (var j = 0; j < layersLength; j++)
            {
                layers[j].scaledYTop = [];
                layers[j].scaledYBottom = [];
                            //maxj++;
                for (var i = start; i < end; i++)
                {
                            //maxi++;
                    layers[j].scaledYTop[i] = scale * (layers[j].yTop[i] - lmin);
                    layers[j].scaledYBottom[i] = scale * (layers[j].yBottom[i] - lmin);
                }
            }
                            //console.log("max i: ", maxi, "max j: ", maxj, "layers length: ", layers.length);
        }

        function _max(a, b){
            return (a > b) ? a : b;
        }

        function _min(a, b){
            return (a < b) ? a : b;
        }


        function drawLayers(layers, isGraphCurved)
        {
            var n = layers.length;
            var m = endPoint;
            var lastLayer = n - 1;

            P.background.apply(this, settings.background); // background(0,0,0,0); -> transparent
            P.pushStyle();
            P.noStroke();

            // Generate graph.
            for (var i = 0; i < n; i++) 
            {
                var layer = layers[i];
                if(layer.onset < endPoint || layer.end > startPoint){
                    //if(color !== undefined){
                        drawLayer(layer, layer.color, (i == lastLayer), isGraphCurved);
                    //}else{
                        //console.log("Color is undefined for", layer);
                    //}
                }
            }

            P.popStyle();
        }

        function drawLayer(layer, color, pxl, isGraphCurved){
            //var ttt = P.millis();
            var start = P.max(startPoint, layer.onset - 1);
            var end   = P.min(m - 1, layer.end);

            //P.colorMode.apply(this, [P.RGB, 255]); // i.e. colorMode(c[0], c[1])
            P.fill.apply(this, color);       // i.e. fill(c[2], c[3], c[4])

            // Draw shape.
            P.beginShape();

            // Draw top edge, left to right.
            graphVertex(start, layer.scaledYTop, isGraphCurved, pxl);
            for (var j = start; j <= end; j++)
                graphVertex(j, layer.scaledYTop, isGraphCurved, pxl);

            graphVertex(end, layer.scaledYTop, isGraphCurved, pxl);

            // Draw bottom edge, right to left.
            graphVertex(end, layer.scaledYBottom, isGraphCurved, false);
            for (var j = end; j >= start; j--)
                graphVertex(j, layer.scaledYBottom, isGraphCurved, false);

            graphVertex(start, layer.scaledYBottom, isGraphCurved, false);

            P.endShape(P.CLOSE);

            //console.log("time to draw 1 layer: ", P.millis() - ttt);
        }

        function graphVertex(point, source, curve, pxl)
        {
            var x = P.map(point, startPoint, endPoint-1, 0, P.width);
            var y = source[point] - (pxl ? 1 : 0);
            //if (curve)
                P.curveVertex(x, y);
            //else
            //    P.vertex(x, y);
        }

        /*function getData(id){
            var index = GraphManager.getDataIndex(id);
            return GraphManager.getData(index);
        }*/

        // Return colorMode, range, color triplet (either in rgb or hsb, specified by colorMode)
        function getColor(layer){
            return layer.color;
        }

        P.mouseClicked = function(){
            //console.log(lastHit);
            var hover = getHitLayer(P, lastHit);
            mouseClickOnLayer(lastHit);
        }

        var cleanupNeeded = false;

        function trueMatch(i){
            // one match maybe coincidence, but two is a confirmation
            P.pushStyle();
            P.fill();
            P.noStroke();
            //console.log("layer", i, layers.length, layers[i]);
            drawLayer(layers[i], [111, 111, 111, 255], false, true);
            var hit = P.get(P.mouseX, P.mouseY-($("body").scrollTop()));
            var match1 = P.red(hit)==111 && P.green(hit)==111 && P.blue(hit)==111;
            if(!match1){
                cleanUp(i);
                return false;
            }

            drawLayer(layers[i], [255, 255, 255, 255], false, true);
            var hit = P.get(P.mouseX, P.mouseY-($("body").scrollTop()));
            var match2 = P.red(hit)==255 && P.green(hit)==255 && P.blue(hit)==255;
            P.popStyle();

            cleanUp(i);
            return match2;
        }

        // clean up after the mess truematch created
        function cleanUp(i){
            P.pushStyle();
            P.fill();
            P.noStroke();
            drawLayer(layers[i], getColor(layers[i]), false, true);
            P.popStyle();
        }

        function colorMatch(i, r, g, b){
            var s = getColor(layers[i]);
            if(s === undefined) return false;

            var colorMatch = s[0] == r && s[1] == g && s[2] == b;
            return colorMatch;
        }

        function getHitIndex(P, lastHit){
            var hit = P.get(P.mouseX, P.mouseY-($("body").scrollTop()));
            //console.log("gethit");

            // return if mouse is still out of any layers
            if(lastHit===-1 && P.alpha(hit)===0){
                return undefined;
            }

            // return if mouse is on the same layer
            if(lastHit!==-1){
                var i = layerTable[lastHit];
                if(trueMatch(i)){
                    return i;
                }
            }

            if(P.alpha(hit)===0){
                return -1;
            }

            for (var i = 0; i < layers.length; i++){
                // Check by colors
                if(colorMatch(i, P.red(hit), P.green(hit), P.blue(hit))){
                    if(trueMatch(i)){
                        return i;
                    }
                }
            }
        }

        function getHitLayer(P, lastHit){
            var i = getHitIndex(P, lastHit);
            if(i === undefined || i === -1)
                return i;
            return layers[i].name;
        }

        // This function should not be changed. 
        // Use mouseEnterLayer() and mouseLeaveLayer() for events
        var lastHit = -1;
        P.mouseMoved = function(){
            var hover = getHitLayer(P, lastHit);

            if(hover == undefined){
                return;
            }
            if(lastHit !== -1 && hover != lastHit){
                mouseLeaveLayer(lastHit);
            }
            if(hover !== -1 && hover != lastHit){
                mouseEnterLayer(hover);
            }
            lastHit = hover;
        }

        //make sure colors are reverted to normal when mouse out the canvas
        P.mouseOut = function(){
            if(lastHit===-1) return;
            mouseLeaveLayer(lastHit);
            if(lastHit != -1){
                lastHit = -1; // set last hit back to -1, resetting mouseover state
            }
        }

    }

    // relay functions for event handlers

    function mouseEnterLayer(id){
        callDelegate("mouseEnter", [id]);
    }

    function mouseLeaveLayer(id){
        callDelegate("mouseLeave", [id]);
    }

    function mouseClickOnLayer(id){
        // undefined or -1 means click on background
        if(id != -1 && id !== undefined){
            callDelegate("mouseClick", [id]);
        }
    }

    // Delegate functions implementation

    var delegateFunctions = {};

    m.onMouseEnterLayer = function(func){
        delegateFunctions["mouseEnter"] = func;
    }

    m.onMouseLeaveLayer = function(func){
        delegateFunctions["mouseLeave"] = func;
    }

    m.onMouseClickLayer = function(func){
        delegateFunctions["mouseClick"] = func;
    }

    function callDelegate(name, params){
        var func = delegateFunctions[name];
        if(typeof func == "function"){
            func(params[0], params[1], params[2]);
        }
    }

    function expandDataArray(offset, array){
        var output = [];
        for(var i=0; i<758; i++){
            output[i] = 0;
        }
        for(var i=0; i<array.length; i++){
            output[i + offset] = array[i];
        }
        return output;
    }

})();
