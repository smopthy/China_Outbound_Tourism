function Spend(data){

var margin = {top: 20, bottom: 100, left: 5, right: 5};
var width = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
    
var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function (d) {
                            return +d.PercentF;
                        })])
                    .range([height, 0]);

var xScale = d3.scale.ordinal()
                    .domain(data.map(function (d) {
                        return d.Spending;
                    }))
                    .rangeBands([0, width], .4); 
    
var color = d3.scale.ordinal()
            .domain(["<$0.77k", "$0.77k-1.5k", "$1.5k-3k", "$3k-4.6k", "$4.6k-6.2k", ">$6.2k"])
            .range(["#ffddcc","#ff661a", "#cc4400","#ff661a","#ff9966","#ffbb99"]);
    
var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(0);

var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");   

var svg = d3.select("#spendchart").append("svg")
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
        .text("Per capita spending");
    
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .classed("bar", true)
        .transition().duration(500).ease("bounce")
        .delay(function (d, i) {
            return i * 500;
        })
        .attr("x", function (d, i) {
            return xScale(d.Spending);
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentF);
        })
        .attr("width", function (d, i) {
            return xScale.rangeBand();
        })
        .attr("height", function (d, i) {
            return height - yScale(+d.PercentF);
        })
        .style("fill", function (d, i) {
            return color(d.Spending);
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
            return i * 600
        })
        .attr("x", function (d, i) {
            return xScale(d.Spending) + xScale.rangeBand() / 2;
        })
        .attr("y", function (d, i) {
            return yScale(+d.PercentF) - 20;
        })
        .attr("dy", 15)
        .text(function (d, i) {
            return +d.PercentF + "%";
        })
        .style("fill", "#ff661a")
        .style("text-anchor", "middle");
    
    svg.selectAll(".bar").on("mouseover", function (d, i) {
            d3.select(this).style("fill", "yellow");
        })
        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", color(d.Spending));
        });

}