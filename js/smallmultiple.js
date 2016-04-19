function smallMultiple(rawData) {

    var fullwidth = 250,
    fullheight = 220,
    margin = {top: 15,right: 20,bottom: 40,left: 40};

  var width = fullwidth - margin.left - margin.right;
  var height = fullheight - margin.top - margin.bottom;

var data = [],
    circle = null,
    caption = null,
    curYear = null;

var bisect = d3.bisector(function(d){
    return d.date;
}).left;
    
var dateFormat = d3.time.format("%Y");
var xScale = d3.time.scale().range([0, width]).clamp(true);
var yScale = d3.scale.linear().range([height, 0]).clamp(true);

var xValue = function(d){return d.date}
var yValue = function(d){return +d.Tourists}

var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(4)
            .outerTickSize(0)
          .tickFormat(d3.format("s"));

var area = d3.svg.area()
            .x(function(d){return xScale(xValue(d)); })
            .y0(height)
            .y1(function(d){ return yScale(yValue(d)); });

var line = d3.svg.line()
           .x(function(d){ return xScale(xValue(d)); })
           .y(function(d){ return yScale(yValue(d)); });


function setupScales(data){
    var extentX;

    extentX = d3.extent(data[0].values, function(d){
        return xValue(d);
    })
        return xScale.domain(extentX);
}

function transformData(rawData){
var dateFormat = d3.time.format("%Y");
var Top10,Changing_Trend,Country;
    
    rawData.forEach(function(d) { 
    d.date = dateFormat.parse(d.Year)
    })
    
    var nest = d3.nest().key(function(d){
     return d.Location;
    })
    .sortValues(function(a,b){ return d3.ascending(a.date, b.date); })
    .entries(rawData);
    
    return nest;

}

var cols, margin_left;
  function calibrate() {
    cols = Math.floor(window.innerWidth/fullwidth),
    margin_left = window.innerWidth%fullwidth/2;
    console.log("cols", cols);
  }

  function getLeft(i) {
    return margin_left + fullwidth * (i%cols) + "px";
  }

  function getTop(i) {
    return 610 + fullheight * Math.floor(i/cols) + "px";
  }

  function setChartDivHeight(data_to_plot) {
  d3.select("#vis").style("height", fullheight * Math.ceil(data_to_plot.length/cols) + "px")
  }

  function layoutCharts(data_to_plot) {
    calibrate();
    setChartDivHeight(data_to_plot);
    setupScales(data_to_plot);

    var charts = d3.select("#vis").selectAll(".chart").data(data_to_plot, function(d) { return d.key; });
    charts.enter().append("div")
      .attr("class", "chart")
      .attr("id", function(d) { return "chart-" + d.key; })
      .style("left", function(d, i) { return getLeft(i); })
      .style("top", function(d, i) { return getTop(i); })
    .each(appendChart);

    charts
      .transition().duration(750).delay(function(d, i) { return i * 10; })
      .style("left", function(d, i) { return getLeft(i); })
      .style("top", function(d, i) { return getTop(i); });

    charts.exit().remove();
  }

var data;
drawPlots(rawData);

function drawPlots(rawData) {
      data = transformData(rawData);
      // default sort order
      data.sort(function(a, b){ return d3.descending(+a.values[a.values.length-1].Tourists, +b.values[b.values.length-1].Tourists); });
    
      layoutCharts(data);
console.log(data);
    }
 
function appendChart(data, i) {
    
     maxY = d3.max(data.values, function(d){
        return +d.Tourists;
    });
    
    yScale.domain([0, maxY]);
    
area.y1(function(d){ return yScale(yValue(d)); });

line.y(function(d){ return yScale(yValue(d)); });

      var svg = d3.select(this).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("rect")
        .attr("class", "background")
        .style("pointer-events", "all")
        .attr("width", width + margin.right) // extra space for labels that appear
        .attr("height", height).on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

      var lines = svg.append("g");

      lines.append("path")
        .attr("class", "area")
        .style("pointer-events", "none")
        .attr("d", function(d) {
          return area(d.values);
      });
      lines.append("path")
        .attr("class", "line1")
        .style("pointer-events", "none")
        .attr("d", function(d) {
        return line(d.values);
      });

      lines.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("y", height)
        .attr("dy", margin.bottom / 2 + 5)
        .attr("x", width / 2).text(function(d) {
          return d.key;
      });

      lines.append("text")
        .attr("class", "static_year")
        .attr("text-anchor", "start")
        .style("pointer-events", "none")
        .attr("dy", 13).attr("y", height)
        .attr("x", 0).text(function(d) {
          return xValue(d.values[0]).getFullYear();
      });
      lines.append("text")
      .attr("class", "static_year")
      .attr("text-anchor", "end")
      .style("pointer-events", "none").attr("dy", 13)
      .attr("y", height).attr("x", width).text(function(d) {
        return xValue(d.values[d.values.length - 1]).getFullYear();
      });

      circle = lines.append("circle")
        .attr("r", 3.2)
        .attr("opacity", 0)
        .attr("class", "circle")
        .style("pointer-events", "none");
      caption = lines.append("text")
        .attr("class", "caption")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("dy", -5);
      curYear = lines.append("text")
        .attr("class", "year")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("dy", 13)
        .attr("y", height);

      svg.append("g").attr("class", "y axis").call(yAxis);

    } 
  
d3.select("#button-wrap").selectAll("button").on("click", function() {
    var id;
    id = d3.select(this).attr("id");
    d3.select("#button-wrap").selectAll("button").classed("selected", false);
    d3.select("#" + id).classed("selected", true);

    // sort methods
    if (id == "Top10") {
      data.sort(function(a, b){ return d3.descending(+a.values[a.values.length-1].Tourists, +b.values[b.values.length-1].Tourists); }); 
    }
    if (id == "Changing_Trend") {
      data.sort(function(a, b) {
        return d3.descending( +a.values[0].Tourists - +a.values[a.values.length-1].Tourists,
           +b.values[0].Tourists - +b.values[b.values.length-1].Tourists);
      });
    }
    if (id == "Country") {
      data.sort(function(a, b) {
        return d3.ascending(a.key, b.key);
      });
    }
    layoutCharts(data);
  });

function mouseover() {
    d3.selectAll("circle").attr("opacity", 1.0);
    d3.selectAll(".static_year").classed("hidden", true);
    return mousemove.call(this); // current graph base
    };

    function mousemove() {
      var date, index, year;
      year = xScale.invert(d3.mouse(this)[0]).getFullYear();
      date = dateFormat.parse('' + year);
      index = 0;
      d3.selectAll("circle")
        .attr("cx", xScale(date))
        .attr("cy", function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);
          return yScale(yValue(d.values[index]));
      });
      d3.selectAll("text.caption").attr("x", xScale(date))
        .attr("y", function(d) {
          return yScale(yValue(d.values[index]));
       }).text(function(d) {
        return yValue(d.values[index]);
        });
      d3.selectAll("text.year").attr("x", xScale(date)).text(year);
    };

    function mouseout() {
      d3.selectAll(".static_year").classed("hidden", false);
      d3.selectAll("circle").attr("opacity", 0);
      d3.selectAll("text.caption").text("");
      d3.selectAll("text.year").text("");
    };
    
}