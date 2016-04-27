var settings = {};

var agechart = d3.select("#agechart");
var marriagechart = d3.select("#marriagechart");
var incomechart = d3.select("#incomechart");
var spendchart = d3.select("#spendchart");
var consumchart = d3.select("#consumptionchart");

var update = function(value) {
    
        var show_age = false;
        var show_marriage = false;
        var show_income = false;
        var show_spend = false;
        var show_consum =  false;
    
        switch(value) {

        case 1:
            console.log("in case", value);
            show_age = true;
            show_marriage = false;
            show_income = false;
            show_spend = false;
            show_consum =  false;
        break;
                
        case 2:
            console.log("in case", value);
             show_age = false;
            show_marriage = true;
            show_income = false;
            show_spend = false;
            show_consum =  false;
        break;
                
        case 3:
            console.log("in case", value);
             show_age = false;
            show_marriage = false;
            show_income = true;
            show_spend = false;
            show_consum =  false;
        break;
                
        case 4:
            console.log("in case", value);
           show_age = false;
            show_marriage = false;
            show_income = false;
            show_spend = true;
            show_consum =  false;
          break;
                
          case 5:
            console.log("in case", value);
           show_age = false;
            show_marriage = false;
            show_income = false;
            show_spend = false;
            show_consum =  true;
          break;
                        
        default:
           show_age = false;
            show_marriage = false;
            show_income = false;
            show_spend = false;
            show_consum =  false;
        break;
        }
//    console.log("show viz", show_age, show_marriage, show_spend);
    
        if (show_age) {
        agechart.style("display", "inline-block");
        } else {
        agechart.style("display", "none");
        }
        if (show_marriage) {
        marriagechart.style("display", "inline-block");
        } else {
        marriagechart.style("display", "none");
        }
          if (show_income) {
        incomechart.style("display", "inline-block");
        } else {
        incomechart.style("display", "none");
        }
          if (show_spend) {
        spendchart.style("display", "inline-block");
        } else {
        spendchart.style("display", "none");
        }
        if (show_consum) {
        consumchart.style("display", "inline-block");
        } else {
        consumchart.style("display", "none");
        }
        };


//window.addEventListener("scroll", handleScroll);
//
//function handleScroll(){
//  var container = document.getElementById ("graphic");
//  var graph = document.getElementById ("agechart");
//  var containerRect = container.getBoundingClientRect();
//  var graphRect = graph.getBoundingClientRect();
//  var graphHeight = graphRect.bottom - graphRect.top;
//  
//  if (containerRect.top > 0){
//    //above
//    $("#agechart").css({
//      "position":"absolute",
//      "top":"0",
//      "bottom":"auto"
//    });
//  } else if(containerRect.bottom > graphHeight){
//    $("#agechart").css({
//      "position":"fixed",
//      "top":"0",
//      "bottom":"auto"
//    });
//  } else{
//    $("#agechart").css({
//      "position":"absolute",
//      "top":"auto",
//      "bottom":"0"
//    });
//  }
//}
