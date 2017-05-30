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


//select all of the <p> elements in the #list (there currently are none!)


//join the `people1` data set to the list item selection


//Log out the `size()` of the data join (think: how many items are selected?)


//For each "entering" element in the data join, create a new <p> item
//Give that item text that contains BOTH the index number of the person and
//their name. For example:
//    <p>0. Edgar</p>
//Additionally, use the `style()` method to give that list item a 'color'
//property that is the person's favorite color.



//Add an event listener to the button to that on a click, the following occurs:
//  Select all the <p> elements in the list
//  Join the `people2` data set to that selection
//      You will need to set a "key function" so people are tracked by `name`
//  Log out the number of "entering" elements
//  Log out the number of "exiting" elements
//  Remove all exiting elements


//Add a transition() to the above so that the existing elements first have
//their `opacity` (set via `style()`) change to 0.0 over 1 second, before
//they are removed
