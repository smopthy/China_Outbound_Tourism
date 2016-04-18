function Firstchart(expenditure, population) {
    
    
   var years = d3.keys(expenditure[0]).slice(0,19);
    var newExp = [];
    expenditure.forEach(function(d,i) {
        years.forEach(function(year) {
            newExp.push({countryName: d.CountryName, 
                            year: year,
                            number: +d[year] * 0.000001
                           });            
        });
    });
        console.log(newExp);

    var newPop = [];
    expenditure.forEach(function(d,i) {
        years.forEach(function(year) {
            var match = population.filter(function(p) {
                return p.CountryName == d.CountryName;
            })[0];
            newPop.push({countryName: d.CountryName, 
                            year: year,
                            number: +d[year] / +match[year]
                           });
        });            
    });
    


    console.log("newPop", newPop);  

    var buttons = d3.selectAll("button")
                .classed("button", true);

    d3.select("#Tot").on("click", function(d, i) {
                d3.selectAll("button").classed("selected", false);
                d3.select(this).classed("selected", true);
                redraw(newExp,59503);
        });

    d3.select("#Per").on("click", function(d, i) {
                d3.selectAll("button").classed("selected", false);
                d3.select(this).classed("selected", true);
                redraw(newPop,3717);
        });

    d3.select("#Tot").classed("selected", true);

var LineChart_width = 800;
var LineChart_height = 400;

var margin = { top: 20, right: 200, bottom: 40, left: 100};

var Chart1width = LineChart_width - margin.right - margin.left;
var Chart1height = LineChart_height - margin.top - margin.bottom;

var dateFormat = d3.time.format("%Y");

var xScale = d3.time.scale()
    .range([0, Chart1width])
    .domain(d3.extent(years, function(d) {
				return dateFormat.parse(d);
					}));
    
var yScale = d3.scale.linear()
    .range([0, Chart1height])
    .domain([d3.max(newExp, function(d) {
                    return +d.number;
                }),
               0]);
    
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(10)
    .tickFormat(function(d) {return dateFormat(d);
							})
    .innerTickSize([0])
    .outerTickSize([0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .outerTickSize([0]);

var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "mytooltip");

var line = d3.svg.line()
    .x(function(d) {return xScale(dateFormat.parse(d.year));
				})
    .y(function(d) {return yScale(+d.number);
				});

var svg = d3.select("#BigLinechart")
    .append("svg")
    .attr("width", LineChart_width)
    .attr("height", LineChart_height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + Chart1height + ")")
            .call(xAxis);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis); 

    redraw(newExp,59503);

function redraw(data,cutoff){
    yScale
    .domain([d3.max(data, function(d) {
                        return +d.number;
                    }),
                   0]);

    var NestNewdata = d3.nest()
        .key(function(d){return d.countryName;})
        .sortValues(function(a, b){ return dateFormat.parse(a.year) - dateFormat.parse(b.year);})
        .entries(data);

        console.log(NestNewdata);

var groups = svg.selectAll("g.lines")
            .data(NestNewdata, function(d){return d.key;});

    groups
            .enter()
            .append("g")
            .attr("class", "lines");

    groups.exit()
        .remove();

    groups.attr("id", function(d) {   
            if (d.key == "China"){
                return "China";
                    } else { 
                    return "other";
                    }
            });

var lines = groups.selectAll("path.line")
             .data(function(d) {return [d.values];});

    lines.enter()
             .append("path")
             .attr("d", line)
             .attr("fill", "none")
             .attr("stroke", "black")
             .attr("stroke-width", 2)
             .attr("class", "line")
             .classed("unfocused", true);

    lines.exit()
            .remove();


    lines
            .classed("HighlightChina", function(d) { 
                    if (d[0].countryName == "China"){
                        console.log("true");
                        return true;
                    } else { 
                    return false; 
                    }
            })
            .transition()
            .duration(1000)
            .attr("d",line);

    d3.select("g.lines#China").moveToFront();

var circles = groups.selectAll("circle")
            .data(function(d) {
                return d.values;
            });

    circles.enter()
                .append("circle")
                .attr("r", 2)
                .classed("circle", true)
                .style("opacity", 0);

    circles.exit()
               .remove();

    circles.transition()
            .attr("cx",function(d){return xScale(dateFormat.parse(d.year));})
            .attr("cy", function(d) {return yScale(+d.number);});

        circles.on("mouseover", mouseoverFunc)
               .on("mousemove", mousemoveFunc)
               .on("mouseout", mouseoutFunc);

var labels = groups.selectAll("text.label")
       .data(function(d){
           return [d.values];});

    labels.enter()
        .append("text")
        .classed("label", true)
        .text(function(d) {
            return d[d.length-1].countryName;});

    labels.exit()
        .remove();

    labels.transition()
        .duration(2000)
        .attr("y",function(d){
            var lastNumber = d[d.length - 1].number;
            return yScale(+lastNumber);})
        .attr("x", function(d){
            var lastYear = d[d.length - 1].year;
            return xScale(dateFormat.parse(lastYear));})
        .attr("dx", ".35em")
        .attr("dy", function(d) {
            if (d[d.length-1].countryName == "China") {
                return "-.5em";
            } else { return ".10em"; }
        });


    labels.classed("textshow", function(d,i){
        if (d && +d[d.length - 1].number > cutoff || d && d[d.length-1].countryName == "China") {
            return true;
    }
        else {return false; };
    });


    labels.classed("texthide", function(d, i) {
        if (d && +d[d.length - 1].number < cutoff && d && d[d.length-1].countryName !== "China" ) {
    return true;
    }
        else {return false; };
    }); 

    groups
    .on("mouseover", TIn)
    .on("mouseout", TOut);

    d3.select(".y.axis").transition().call(yAxis);

    }

function mouseoverFunc(d){
        d3.select(this)
            .transition()
            .style("opacity", 1)
            .attr("r", 4);


       if (d3.select("#Tot").classed("selected")) {

           return tooltip
            .style("display", null)
            .html("<p>Country: <span style='color:#b35900'>" + d.countryName +"</span>" + "<br>Year: <span style='color:#b35900'>" + d.year +"</span>" + "<br>Total:<span style='color:#b35900'> " + d.number + "</span>" + "</p>");
       }

        else {

        return tooltip
            .style("display", null)
            .html("<p>Country: <span style='color:#b35900'>" + d.countryName +"</span>" + "<br>Year: <span style='color:#b35900'>" + d.year +"</span>" + "<br>Per Capita:<span style='color:#b35900'> " + d3.round(+d.number, 1)+ "</span>" + "</p>");
        }
    } // end mouseover

function mousemoveFunc(d) {
        console.log(d3.event.pageX, d3.event.pageY);
        tooltip
            .style("top", (d3.event.pageY - 5) + "px" )
            .style("left", (d3.event.pageX + 5) + "px");
    }

function mouseoutFunc(d) {
          d3.select(this)
            .transition()
            .style("opacity", 0)
            .attr("r", 2);
          tooltip.style("display", "none");}

function TIn(d) {
    d3.select(this).select("path")
        .classed("unfocused", false)
        .classed("focused", true);
    d3.select(this).select("text.label")
        .attr("id", "highlight");

    }

function TOut(d) {
    d3.select(this).select("path")
        .classed("unfocused", true)
        .classed("focused", false);
    d3.select(this).select("text.label")
        .attr("id",null);
    }

}