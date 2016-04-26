d3.csv("FamilyIncome.csv", function(error, data){
 if (error) {
    console.log("Error");
 } 

var margin = {top: 20, bottom: 100, left: 50, right: 60};
var width = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
    
var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function (d) {
                            return +d.PercentD;
                        })])
                    .range([height, 0]);

var xScale = d3.scale.ordinal()
                    .domain(data.map(function (d) {
                        return d.FamilyIncome;
                    }))
                    .rangeBands([0, width], .3); 
    
var color = d3.scale.ordinal()
            .domain(["<$1.5k", "$1.5k-3.1k", "$3.1k-4.6k", "$4.6k+"])
            .range(["#ffddcc", "#ff661a", "#ff9966", "#ffbb99"]);
    
var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(0);

var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");   

var svg = d3.select("#familyincomechart").append("svg")
		.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    svg.selectAll(".x.axis")
        .append("text")
        .style("text-anchor", "middle")
        .classed("xtitle", true)
        .attr("transform", "translate(" + width / 2 + ", 40)");
    
    svg.select(".x.axis")
        .append("text")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("transform", "translate(" + width / 2 + ", 50)")
        .text("Family monthly incomes");
    
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .classed("bar", true)
        .transition().duration(500).ease("bounce")
        .delay(function (d, i) {
            return i * 800;
        })
        .attr("x", function (d, i) {
            return xScale(d.FamilyIncome);
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentD);
        })
        .attr("width", function (d, i) {
            return xScale.rangeBand();
        })
        .attr("height", function (d, i) {
            return height - yScale(+d.PercentD);
        })
        .style("fill", function (d, i) {
            return color(d.FamilyIncome);
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
            return i * 1100
        })
        .attr("x", function (d, i) {
            return xScale(d.FamilyIncome) + xScale.rangeBand() / 2;
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentD) - 20;
        })
        .attr("dy", 15)
        .text(function (d, i) {
            return +d.PercentD + "%";
        })
        .style("fill", "#ff661a")
        .style("text-anchor", "middle");
    
    svg.selectAll(".bar").on("mouseover", function (d, i) {
            d3.select(this).style("fill", "yellow");
        })
        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", color(d.FamilyIncome));
        });

})