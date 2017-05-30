'use strict';
//script goes here!
//d3 has already been "imported"

var dataList = [
   {id:1, name:'A', sleep:8},
   {id:2, name:'B', sleep:3},
   {id:3, name:'C', sleep:6},
]

var svg = d3.select('svg'); //reference to the HTML element

var rects = d3.selectAll('rect')
.attr('fill', 'pink');

var dataJoin = rects.data(dataList);
console.log(dataJoin.size())
//a function that determines width of a rectangle based on a datum
/* var calcWidth = function(datum, index){
    return datum.sleep*50;  //width is based on the amount of sleep
} */

//set the width attr, using the callback to calculate the width
//for each (bound) element in the selection
dataJoin.attr('width', function(d,i){return d.sleep*50;});
var entering = dataJoin.enter();
console.log(entering.size())

