'use strict';
//d3 has already been "imported"

console.log('hi');

/** Data Sets */
var exam1 = [
  {id:1, student:'Jade', grade:95},
  {id:2, student:'Billy', grade:90},
  {id:4, student:'Avery', grade:80},
];

var exam2 = [
  {id:1, student:'Jade', grade:75},
  {id:2, student:'Billy', grade:85},
  {id:3, student:'Rose', grade:90},
  {id:4, student:'Avery', grade:90},
  {id:5, student:'Priya', grade:85},
];

var exam3 = [
  {id:1, student:'Jade', grade:95},
  {id:3, student:'Rose', grade:80},
  {id:4, student:'Avery', grade:70},
  {id:5, student:'Priya', grade:100},
];

var svg = d3.select('svg'); //the svg image


//Define a new function `update()` that takes in an Array of student Objects (with the format used in the above data sets), and applies the General Update Pattern.
function update(newDataSet){

  //Select all the <rect> elements in the SVG, and join the given data to them
  //Use the object's `id` property as the "key" for joining
  var rects = svg.selectAll('rect').data(newDataSet, function(d) {return d.id});

  //Create new <rect> elements for all the "entering" data, and give them a `width`
  //attribute of 0 and a `fill` attribute of '#286090'.
  //`merge()` the entering elements into the selection (reassigning the variable)
  var present = rects.enter()
      .append('rect')
      .attr('width', 0)
      .attr('fill','#286090')
      .merge(rects);

  //Modify all present elements (including the entered ones) so they have attributes:
  //  `x` of 20
  //  `y` of the element's index*40+20
  //  `width` of the student's grade
  //  `height` of 30
  //  `color` of '#286090'
  //Use a transition over 500ms to animate these changes
  //console.log('transition');
  present
      .transition().duration(500)
        .attr('x', 20)
        .attr('y', function(d,i){console.log(d); return 20+i*40})
        .attr('width', function(d){return 2*d.grade})
        .attr('height', 30)

  //Give all exiting elements a `width` attribute of 0, then remove them.
  //Use a transition over 500ms to animate these changes.
  rects.exit()
      .transition().duration(500)
      .attr('width', 0)
      .remove()
  
  /** Apply the same data joining and update pattern for <text> elements.
   * Give entering and updating elements a text() of the student's name,
   * a `fill` attribute of 'white', an `x` attribute of 25, and a `y`
   * attribute of the element's index*40 + 40.
   * Use a similar transition for updating the attributes!
   **/
  var texts = svg.selectAll('text').data(newDataSet, function(d) {return d.id})
   
  present = texts.enter().append('text')
      .merge(texts)

  present
      .transition().duration(500)
          .text(function(d){return d.student})
          .attr('fill', 'white')
          .attr('x', 25)
          .attr('y', function(d,i){return 40+i*40})
    
  texts.exit().remove()
}


//An example of handling multiple buttons!
d3.selectAll('button').on('click', function(){
  //get the id of which element caused the event
  var whichButton = d3.select(d3.event.target).attr('id');

  //determine what to do based on that id
  if(whichButton == 'exam1'){
    update(exam1);
  }
  else if(whichButton == 'exam2'){
    update(exam2);
  }
  else if(whichButton == 'exam3'){
    update(exam3);
  }
});
