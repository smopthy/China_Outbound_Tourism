
$.getJSON({
    url: "data/china.json",
    success: makeMap
});

// map making code goes in here
function makeMap(china) {

    var center = d3.geo.centroid(china);
    /*
        First we need to create the actual d3 map
    */
    // a good h/w ratio for this map;
    var ratio = 500/960;
    
    var mapwidth = 500,
        mapheight = 500;
    
    var projection = d3.geo.mercator()
        .scale(mapwidth)
        .center(center)
        .translate([mapwidth/2, mapheight/2]);
    
    var path = d3.geo.path()
        .projection(projection);
    
    var svg = d3.select("#map").append("svg")
        .attr("mapwidth", mapwidth + 200)
        .attr("mapheight", mapheight);
    
    var g = svg.append("g");
    
    console.log(china);

    var states = g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(china.features)
        .enter().append("path")
        //.attr('id', function(d) { 
         //   return "fips_" + d.id; })
        .attr("d", path);
    
    // add states we will explode! (these stay 
    // add states which will form the static map
    var explode_states = g.append("g")
        .attr("id", "explode-states")
        .selectAll("path")
        .data(china.features)
        .enter().append("path")
       // .attr('id', function(d) { return "fips_" + d.id; })
        .attr("d", path);    
    
    // Here is the magic!
    // This exploder will create a grid of the states
    // when called on a featurelist selection
    var exploder = d3.geo.exploder()
        // use the same projection as the map
        .projection(projection)
        // size the state to have an area of 150 pixels
        .size(function(d, i) { return 100; })
        // position the center of the state 3/4 of the width and 1/2 the height
        .position(function(d, i) {
            return [650, mapheight/2-30];
        })    

    

    
    var highlighted_state = null;
    
    explode_states.on('click', function() {
    
        d3.selectAll('.highlighted-state')
            .transition()
            .duration(500)
            .attr("d", path)
            .attr("transform", "translate(0,0)")
            .each('end', function() {
                d3.select(this).classed('highlighted-state', false);
            })
            
        d3.select(this)
            .classed('highlighted-state', true)
            .transition()
            .duration(500)
            .call(exploder); 
    });

}
