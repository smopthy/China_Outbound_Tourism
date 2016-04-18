queue()
    .defer(d3.csv, "data/TourismExpenditure1995_2013.csv")
    .defer(d3.csv, "data/population.csv")
    .defer(d3.json, "data/china.json")
    .defer(d3.csv, "data/TopPlace.csv")
    .await(ready);
      
function ready(error, expenditure,population,china,countrymultiple) {

console.log(error, expenditure, population,china);
    
    Firstchart(expenditure, population);
    makeMap(china);
    smallMultiple(countrymultiple);
}



d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
