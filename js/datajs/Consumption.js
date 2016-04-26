d3.csv("Consumption.csv", function(error, data){
 if (error) {
    console.log("Error");
 } 

var margin = {top: 20, bottom: 200, left: 80, right: 20};
var width = 450 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;
    
var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function (d) {
                            return +d.PercentG;
                        })])
                    .range([height, 0]);

var xScale = d3.scale.ordinal()
                    .domain(data.map(function (d) {
                        return d.Consumption;
                    }))
                    .rangeBands([0, width], .2); 
    
var color = d3.scale.ordinal()
            .domain(["Shopping", "Lodging", "Transport", "Food", "Attraction tickets", "Entertainment", "Tipping"])
            .range([ "#cc4400", "#ff661a", "#ff9966", "#ffbb99","#ffddcc", "#ffddcc", "#ffddcc"]);
    
var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(0);

var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");   

var svg = d3.select("#consumptionchart").append("svg")
		.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .classed("xtitle", true)
        .style("text-anchor", "end")
        .attr("dx", -8)
        .attr("dy", 3)
        .attr("transform", "translate(0, 0) rotate(-45)");
    
    svg.select(".x.axis")
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("transform", "translate(" + width / 2 + ", 120)")
        .text("Consumption Category");

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .classed("bar", true)
        .transition().duration(500).ease("bounce")
        .delay(function (d, i) {
            return i * 200;
        })
        .attr("x", function (d, i) {
            return xScale(d.Consumption);
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentG);
        })
        .attr("width", function (d, i) {
            return xScale.rangeBand();
        })
        .attr("height", function (d, i) {
            return height - yScale(+d.PercentG);
        })
        .style("fill", function (d, i) {
            return color(d.Consumption);
        });
    
    svg.selectAll("bar.label")
        .data(data)
        .enter()
        .append("text")
        .classed("barlabel", true)
        .transition()
        .duration(500)
        .ease("bounce")
        .delay(function (d, i) {
            return i * 300
        })
        .attr("x", function (d, i) {
            return xScale(d.Consumption) + xScale.rangeBand() / 2 + 5;
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentG) - 20;
        })
        .attr("dy", 15)
        .text(function (d, i) {
            return +d.PercentG + "%";
        })
        .style("fill", "#ff661a")
        .style("text-anchor", "middle");
    
    svg.selectAll(".bar").on("mouseover", function (d, i) {
            d3.select(this).style("fill", "yellow");
        })
        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", color(d.Consumption));
        });

})