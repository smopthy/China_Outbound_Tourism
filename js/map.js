function makeMap(china, provinces){

    var color = d3.scale.threshold()
    .domain([0.8, 2, 4, 8, 16])
    .range(["#ffeee6", "#ffccb3", "#ff884d", "#ff661a", "#e64d00", "#802b00"]);

provinces.forEach(function(province){
var dataPro = province.name;
    var dataValue = +province.Percentage;
    var population = +province.Population;
    var res = +province.Residents;
    
    china.features.forEach(function(j){
    var chinaPro = j.properties.ADM1;
        if (dataPro == chinaPro) {
        j.properties.Percent = dataValue;
        j.properties.Population = population;
        j.properties.Residents = res;
        }
    });

});
 
    var center = d3.geo.centroid(china);
    var ratio = 500/960;
    
   
        
        var width = 500;
        var height = 500;
    
    var projection = d3.geo.mercator()
        .scale(width)
        .center(center)
        .translate([width/2, height/2]);
    
    var path = d3.geo.path()
        .projection(projection);
    
    var svg = d3.select("#map").append("svg")
        .attr("width", width + 200)
        .attr("height", height);
    
    var chinadata = china.features;
    
      var pop = d3.extent(chinadata, function(d) {return +d.properties.Population});
      var res = d3.extent(chinadata, function(d) {return +d.properties.Residents});
      // setup x
      var xScale = d3.scale.linear().range([0, width]).domain(pop), // value -> display
          xAxis = d3.svg.axis().scale(xScale).orient("bottom");

      // setup y
      var yScale = d3.scale.linear().range([height, 0]).domain(res), // value -> display
          yAxis = d3.svg.axis().scale(yScale).orient("left");

      // x-axis
      var x_axis_g = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height) + ")")
          .call(xAxis).style('opacity', 0);

      x_axis_g.append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Population");

      // y-axis
      var y_axis_g = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .style('opacity', 0);

      y_axis_g.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 12)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Resident Income");
    
    var g = svg.append("g");
  
    var states = g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(chinadata)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { var value = d.properties.Percent;
            return color(value); });
    
    var explode_states = g.append("g")
        .attr("id", "explode-states")
        .selectAll("path")
        .data(chinadata)
        .enter().append("path")
        .attr("d", path)
      .style("fill", function(d) { var value = d.properties.Percent;
      return color(value); });
   
     var default_size = function(d, i) { return 100; };
      var exploder = d3.geo.exploder()
                      .projection(projection)
                      .size(default_size)
                      .position(function(d,i){ return [650, height/2]});
    // Here is the magic!
    // This exploder will create a grid of the states
    // when called on a featurelist selection
    
   
    
    function addButton(text, callback) {
        d3.select("#buttons").append('button')
          .text(text)
          .attr("class", "button")
          .on('click', function() {
            // clear running animation
            
            // hide axis
            x_axis_g.transition().duration(500).style('opacity', 0);
            y_axis_g.transition().duration(500).style('opacity', 0);
            // reset to default size
            exploder.size(default_size);
            callback.call(this);
          })
      }

      addButton('scatter', function(d, i) {


        // hide axis
        x_axis_g.transition().duration(500).style('opacity', 1);
        y_axis_g.transition().duration(500).style('opacity', 1);

        states.transition()
              .duration(500)
              .call(
        exploder
            .size(function(d, i) { return 40; })
            .position(function(d, i) {
                  var x = xScale(+d.properties.Population);
                  var y = yScale(+d.properties.Residents);
                  return [x, y];
                })
              );
          
          explode_states.style("display", "none");

      });

      addButton('reset', function() {
        states.transition()
              .duration(500)
              .attr("d", path)
              .attr("transform", "translate(0,0)");
          
        
           //  .call(
      //  exploder
            //.size(function(d, i) { return 100; })
           // );
//            .position(function(d, i) {
//            return [650, height/2-30];
//                
    
          exploder.position(function(d, i) {
              return [650, height/2-30];
          });
          
          explode_states.style("display", null);
});
    
              var highlighted_state = null;
    
    
    explode_states.on('click', function() {
    
        d3.selectAll('.highlighted-state')
            .transition()
            .duration(500)
            .attr("d", path)
            .attr("transform", "translate(0,0)")
            .each('end', function() {
                d3.select(this).classed('highlighted-state', false)
                
            })
            
        d3.select(this)
            .classed('highlighted-state', true)
            .transition()
            .duration(500)
            .call(exploder); 
    });
    
}