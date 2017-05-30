'use strict';
//d3 has already been "imported"

/** data sets **/
var people1 = [
  {name:'Edgar', favColor:'green'},
  {name:'Rashmi', favColor:'#000000'},
  {name:'Amelia', favColor:'blue'}
];

var people2 = [
  {name:'Edgar', favColor:'green'},
  {name:'Amelia', favColor:'blue'}
];

//Create a variable `list` by selecting the element with an ID of `list`
var list = d3.select('#list');

//select all of the <p> elements in the #list (there currently are none!)
var listItems = list.selectAll('p');

//join the `people1` data set to the list item selection
var dataJoin = listItems.data(people1);

//Log out the `size()` of the data join (think: how many items are selected?)
console.log("join size:", dataJoin.size());

//For each "entering" element in the data join, create a new <p> item
//Give that item text that contains BOTH the index number of the person and
//their name. For example:
//    <p>0. Edgar</p>
//Additionally, use the `style()` method to give that list item a 'color'
//property that is the person's favorite color.
dataJoin.enter()
    .append('p')
    .text(function(d,i) {
      return i+". "+d.name
    })
    .style('color', function(d){
      return d.favColor;
    });


//Add an event listener to the button to that on a click, the following occurs:
//  Select all the <p> elements in the list
//  Join the `people2` data set to that selection
//      You will need to set a "key function" so people are tracked by `name`
//  Log out the number of "entering" elements
//  Log out the number of "exiting" elements
//  Remove all exiting elements
d3.select('button').on('click', function() {
  var dataJoin = d3.select('#list').selectAll('p')
      .data(people2, function(d){ return d.name; });

  console.log("entering:", dataJoin.enter().size());

  console.log("exiting:", dataJoin.exit().size());

  dataJoin.exit()
      .transition()
          .duration(1000)
          .style('opacity',0.0)
      .remove();
});

//Add a transition() to the above so that the existing elements first have
//their `opacity` (set via `style()`) change to 0.0 over 1 second, before
//they are removed
