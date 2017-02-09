queue()
    .defer(d3.csv, "data/TourismExpenditure1995_2013.csv")
    .defer(d3.csv, "data/population.csv")
    .defer(d3.json, "data/china.json")
    .defer(d3.csv, "data/Outbound_travelers_by_province.csv")
    .defer(d3.csv, "data/TopPlace.csv")
    .defer(d3.csv, "data/Age.csv")
    .defer(d3.csv, "data/Marriage.csv")
    .defer(d3.csv, "data/Income.csv")
    .defer(d3.csv, "data/Spending.csv")
    .defer(d3.csv, "data/Consumption.csv")
    .await(ready);
      
function ready(error,expenditure,population,china,provinces,countrymultiple,age, marriage, income, spend, consum) {

console.log(error, expenditure, population, china, provinces,countrymultiple,age,marriage, income, spend, consum);
    
    Firstchart(expenditure, population);
    makeMap(china, provinces);
    smallMultiple(countrymultiple);
    Age(age);
    Marriage(marriage);
    Income(income);
    Spend(spend);
    Consum(consum); 
    
    var scroll = scroller()
    .container(d3.select('#graphic'));
   scroll(d3.selectAll('.step'));
  scroll.update(update);  
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


$('.header').stickyNavbar();



