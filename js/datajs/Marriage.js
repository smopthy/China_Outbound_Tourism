function Marrychart(data){
var margin = {top: 20, bottom: 200, left: 80, right: 20};
var width = 450 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;
    
var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function (d) {
                            return +d.PercentB;
                        })])
                    .range([height, 0]);

var xScale = d3.scale.ordinal()
                    .domain(data.map(function (d) {
                        return d.Marriage;
                    }))
                    .rangeBands([0, width], .2); 
    
var color = d3.scale.ordinal()
            .domain(["Single", "Married & no children", "Married & children under 18", "Married & children over 18"])
            .range(["#ff661a", "#ff9966", "#cc4400","#ffbb99"]);
    
var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(0);

var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");   

var svg = d3.select("#marriagechart").append("svg")
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
        .attr("transform", "translate(" + width / 2 + ", 175)")
        .text("Marital and Family Status");

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
            return xScale(d.Marriage);
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentB);
        })
        .attr("width", function (d, i) {
            return xScale.rangeBand();
        })
        .attr("height", function (d, i) {
            return height - yScale(+d.PercentB);
        })
        .style("fill", function (d, i) {
            return color(d.Marriage);
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
            return xScale(d.Marriage) + xScale.rangeBand() / 2 + 5;
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentB) - 20;
        })
        .attr("dy", 15)
        .text(function (d, i) {
            return +d.PercentB + "%";
        })
        .style("fill", "#ff661a")
        .style("text-anchor", "middle");
    
    svg.selectAll(".bar").on("mouseover", function (d, i) {
            d3.select(this).style("fill", "yellow");
        })
        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", color(d.Marriage));
        });

}