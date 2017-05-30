# Module 19: D3 Visualizations

While the [D3 library](https://d3js.org/) can be used to do fundamental DOM manipulations and event handling, the true power of the library comes in its ability to create **dynamic, data-driven visualizations**&mdash;graphical representations of data sets that can change in response to changes in the data. In particular, D3 provides robust tools that make it easy to relate (**join**) the _DOM elements_ shown on the screen (most commonly, SVG shapes) to the values in a data _array_. Then it is just up to you to specify how the data should be related to _visual properties_ of the DOM in order to create a visualization.

This module will introduce the basics of creating data-driven visualizations using using D3, including data joining, data scaling, axes and decorations, and animations.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Resources](#resources)
- [The Data Join](#the-data-join)
  - [Entering and Exiting Elements](#entering-and-exiting-elements)
    - [Object Consistency](#object-consistency)
    - [The General Update Pattern](#the-general-update-pattern)
- [Scales](#scales)
  - [Axes](#axes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Resources
Note that some of these resources may not be up-to-date with D3 version 4.0 (what we are importing by default).

- [D3 Tutorials (Official)](https://github.com/d3/d3/wiki/Tutorials),
  - [Three Little Circles (Bostock)](http://bost.ocks.org/mike/circles/)
  - [Thinking with Joins (Bostock)](https://bost.ocks.org/mike/join/)
  - [General Update Pattern (Bostock)](http://bl.ocks.org/mbostock/3808218)
  - [Margin Convention](https://bl.ocks.org/mbostock/3019563)
- [Interactive Data Visualization for the Web (Murray)](http://chimera.labs.oreilly.com/books/1230000000345/index.html)
  - [Scales](http://chimera.labs.oreilly.com/books/1230000000345/ch07.html)
  - [Axes](http://chimera.labs.oreilly.com/books/1230000000345/ch08.html)
- [D3 Scales and Colors](http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/) (v3, but a good summary of features)
- [INFO 474 Interactive Data Visualization (Freeman)](https://github.com/INFO-474). See in particular [module 7](https://github.com/INFO-474/m7-d3-intro) and [module 8](https://github.com/INFO-474/m8-scales).


## The Data Join
To start, consider an **array of objects** representing a _table_ of data (similar to what we've used before):

```js
var peopleTable = [
    {name: 'Ada', mathExam: 100, spanishExam: 83},
    {name: 'Bob', mathExam: 82, spanishExam: 88},
    {name: 'Chris', mathExam: 78, spanishExam: 92},
    {name: 'Diya', mathExam: 91, spanishExam: 79},
    {name: 'Emma', mathExam: 93, spanishExam: 87}
];
```

At its most basic level, a **data visualization** is a graphical image whose components (e.g., shapes) represent different elements in the array (observations/rows of the data). For example, a bar chat may have a single `rectangle` for each element in the array, a scatter plot may have a single `circle` for each element, and a line chart may have a `path` with a different "control point" for each element. D3 will let us _programmatically_ associate an SVG element (or set of elements) with each element in a JavaScript array in order to define this visualization. For example, each of the five items in the above `peopleTable` could be associated with one of five `<rect>` elements in a bar chart.

Moreover, we also want each shape in our visualization to have a different appearance based on the properties (_fields_) of the data. For example, the `width` attribute of a `<rect>` may depend on the `mathExam` of the array element, and the `y` attribute may depend on the _index_ of that element in the array. Thus we need to define a **mapping** between data properties and the [___visual attributes___](http://www.infovis-wiki.net/index.php?title=Visual_Variables) (size, position, color, etc.) of each component in the visualization.

D3 lets us create a mapping between an _array_ of data and a _selection_ of DOM elements&mdash;what is called **the data join** (the "joining" of data with the selection). We do this by calling the **`data()`** method _on_ the selection of DOM elements, and passing in the array of data we wish to map to those elements:

```js
var rects = svg.selectAll('rects');  //selection of all rects in the SVG
var dataJoin = rects.data(peopleTable);  //join with the people table
```

This join associates each element in the array for a single element in the selection pair-wise (e.g., the first DOM element is associated with the first array element, the second with second, and so on).

Once data has been joined to the selection, it is possible to modify the attributes of the DOM elements (as we've done previously) utilizing that element's associated **datum** (data item). We do this by passing a _callback function_ to the `attr()` method. This callback function can take in the _datum_ and the _index_ in the array as arguments, and should return the appropriate value for the attribute for that particular attribute:

```js
//a function that determines width of a rectangle based on a datum
var calcWidth = function(datum, index){
    return datum.mathExam;  //width is the math score
}

//set the width attribute, using the callback to calculate the width
//for each (bound) element in the selection
dataJoin.attr('width', calcWidth);
```

- Remember that the `attr()` function is _vectorized_, so called individually on each element in the selection!

- Note that the `index` was not used&mdash;technically, we could have left it out of the argument list!

- If you wish to refer to the DOM element itself inside the callback function, that value is assigned to a variable called **`this`**.

Note that we almost always use _anonymous callback functions_ for this, and abbreviate the arguments to `d` and `i` to save space:

```js
//this is equivalent to the above
dataJoin.attr('width', function(d,i) { return d.mathExam; });  //compact one-line!
```

You can of course use this process to specify all of the different attributes of an SVG element, including sizes, position, fill and stroke colors, etc. It is also possible to pass a calculating callback function to most selection methods (including e.g. the `style()` function if you want to use CSS styles).

- Similarly, the `on()` event handler callback takes in the _datum_ and _index_ as arguments, if you wish to refer to the joined data when a user clicks on an element.


### Entering and Exiting Elements
Importantly, it is possible that the _size_ the data array might not match the size of the selection! While the data table might have 5 elements (as above), the selection might have 3, 6, or even 0 `rect` elements! In this situation, we cannot just join the the data to the selection, since there isn't a one-to-one mapping.

In D3 the any joined _data_ elements that lack corresponding DOM elements are referred to as the **enter selection** (they are data elements that need to "enter" the visualization). They can be accessed calling the **`enter()`** method _on the data join_. This will return a selection of null-like "placeholder" elements, each of which is joined with a data item (that didn't otherwise have an element to join with). Most commonly, we then use the `append()` method to create a new DOM element for each item in this selection:

```html
<!-- Assume an empty list -->
<ul id="#list"></ul>
```

```js
//add a <li> for each number in an array:
var listItems = d3.select('#list').selectAll('li');  //select the (zero) <li>
var dataJoin = listItems.data([3,1,4,1,5]);  //join with an array of data
var enterSelection = dataJoin.enter();  //get the enter selection
enterSelection.append('li') //add a new <li> for each "placeholder"
    .text(function(d){return d;})  //set the text to be the datum
```

This would produce the HTML:

```html
<ul id="#list">
  <li>3</li>
  <li>1</li>
  <li>4</li>
  <li>1</li>
  <li>5</li>
</ul>
```

- Note that we can and do chain most of these calls together, rather than defining a separate `enterSelection` variable.

- **Important!** Notice how this lets us create elements for data without needing to specify any DOM for those elements ahead of time! This means that you do not need to write any SVG elements in the HTML, and instead can just `append()` elements for the `enter()`ing data.

Equivalently, any _DOM elements_ that lack a joined data element are referred to as the **exit selection** (they are DOM elements that need to "exit" the visualization). They can be accessed by calling the **`exit()`** method _on the data join_. This will return a selection of elements, none of which have a datum joined to them. Most commonly, we then use `remove()` to remove these data-less elements from the DOM:

```js
//select the above HTML (5 <li> elements)
var listItems = d3.select('#list').selectAll('li');  //select the (5) <li>
var dataJoin = listItems.data([3,4,5]);  //join with an (smaller) array of data
var exitSelection = dataJoin.exit();  //get the enter selection
exitSelection.remove() //remove the extranous <li>
```

To summarize:

- `data()` returns the items in the data array ___and___ in the DOM
- `enter()` returns items in the data array ___and not___ in the DOM
- `exit()`  return items in the DOM ___and not___ in the data array

#### Object Consistency
As data is "entering" and "exiting" over time (e.g., in response to user interaction), it is important to make sure that we are _consistent_ about the mapping between the data and DOM elements. If we do a second data join with a smaller array of data (a sub-list), we want to make sure we remove the correct elements (and not just the ones at the end). Similarly, if we do a data join with a larger array of data, we want to make sure we append elements only for the data that isn't already shown.

By default, the `data()` join will associate the first datum with the first DOM element, the second datum with the second DOM element, and so on. But this means that if we later remove the first datum element, then "which" DOM element is associated with which datum will change (e.g., the previously-second datum is joined with the first DOM element). This can cause problems, particularly for utilizing [animations](https://bost.ocks.org/mike/constancy/).

In order to make sure that our joining remains consistent, we specify a second argument to the `data()` function, known as the **key function**. This is a _callback function_ (which takes the datum and index as arguments, as usual) that should return a _unique string identifier_ for each datum&mdash;in effect, the "key" that D3 can use to look up that datum when joining:

```js
//rectangle selected from above example
var rects = svg.selectAll('rects');
var dataJoin = rects.data(peopleTable, function(d) {
    return d.name;  // use the `name` property as the "key"
});
```

- It is common to use properties such as `name` or `id` as the key function&mdash;if you are familiar with databases, these would be the [foreign keys](https://en.wikipedia.org/wiki/Foreign_key).

- **Caution**, when you first call the `data()` function, the key function callback is executed once for each DOM element already in the selection, _and then_ once for each new datum in the data. This means that if your selection included any un-joined DOM elements (e.g., because you started off with some hard-coded `<rect>` elements), then the `datum` argument to the callback will be `undefined`. The best strategy is to always `append()` entering DOM elements!

#### The General Update Pattern
When modifying the visualized data in response to use interaction, it is very common for a data join to include both "entering" and "existing" (e.g., some new data added, and some old data removed). In fact, whenever you do a data join, there are 3 possible situations:

1. The data has _"updating"_, and the DOM attributes need to be modified accordingly. These are for previously joined datum, and so will be included in the `data()` selection.
2. The data is _"incoming"_, and so new elements need to be added to the DOM. This data will be included in the `enter()` selection.
3. The data is _"outgoing"_, and so elements need to be removed from the DOM. These elements will be included in the `exit()` selection.

As such, "updating" a visualization with a new data join involves a few steps, as detailed below:

```js
function update(newDataArray) {
    //perform the data join with the "new" data list
    var rects = svg.selectAll('rect')
                  .data(newDataArray, keyFunc);  //key function for consistency

    //Update already bound elements (that are not coming or going)
    rects.classed('updated', true);  //add style class to updating

    //Handle entering elements
    var present = rects.enter().append('rect')  //add new DOM elements
                .classed('new', true)  //add style class to entering
                .merge(rect); //save new DOM elements in a selection

    //Handle now present elements (the merged selection)
    present.classed('here', true);  //add style class to current (including new)

    //Handle exiting elements (from original selection)
    rects.exit().remove();
}
```

- The stages of this process are:

  1. Use `data()` to join the elements; modify the attributes of any that are bound.
  2. Use `enter()` to create new elements; modify the attributes of the new elements.
  3. Use `merge()` to combine the old and new; modify the attributes of anything that will stay.
  4. Use `exit()` to remove old elements.

- Note that we have encapsulated these steps into a function for re-use!

This process is known as the [General Update Pattern](https://bl.ocks.org/mbostock/3808218), and is the recommended way of handling _dynamic_ (interactive) data visualizations. Every time the data needs to change&mdash;whether because the user interacted with the web page, or the the data was being "live streamed" from an API&mdash;you call this general update function. The function will join the now-current data to visualize, and then update the DOM elements that make up the visualization in order to match the latest data.

- In developing the `update()` function, you specify what the visualization should look like for _any_ set of data. Then you can change the data however you want, and the visualization will continue to reflect that!

<!-- ## Animation -->
<!-- //transitions
//can skip for time, encourage students to look it up? Did do an example in an exercise... -->

## Scales
In the `peopleTable` example, we _mapped_ exam scores to the `width` attribute directly: each point on an exam corresponded to a single unit (pixel) of width. But what if we were visualizing very small data (e.g., daily interest on a small investment) or very large data (e.g., number of books held by a library)? We would need to _scale_ the values used: that is, $0.001 earnings might be 20 pixels, or 100 books might be a single pixel.

![Scaling example](img/d3scale1.png)

In D3, a **scale** is a function that _maps_ from the data ___domain___ (in data values) to the visualization's ___range___ (in pixel values) in a consistent way. For example, if we wanted to perform the scaling illustrated in the above diagram we would need to have the _domain_ of 20 to 80 (length of 60) map to the _range_ of 0 to 120 (length of 120). We could write a function that does the math to do this for any individual value within the range!

```js
var diagramScale = function(value){
  var domainLength = 80-20; //length of domain
  var rangeLength = 120-0; //length of range

  //transform value to be between 0 and domainLength
  var shifted = value - 20;  // 50 => 30

  //scale (enlarge) the domain to the range
  var rangeValue = shifted*(rangeLenth/domainLength);  // 30 => 60

  return rangeValue;
}

//example
var result = diagramScale(50);  //60, as above
```

- This math is doable, but can be tedious&mdash;especially if the mapping needs to be more complex (such as using a _logarithmic_ scale, or scaling values like colors).

Because scaling is such a common operation, D3 provides a set of [helper functions](https://github.com/d3/d3-scale) that can be used to easily generate these _scaling functions_, allowing you to quickly specify a mapping (and dynamically change that mapping if the domain of the displayed data changes!)

We can create a simple (linear) scale by calling the `d3.scaleLinear()` function. This function **returns a new function** that can be used to do the scaling!

```js
//create the scale function
var scaleDiagram = d3.scaleLinear()
                       .domain([20,60]) //specify the domain
                       .range([0,120]); //specify the range

var result = diagramScale(50); //60, as above
var source = diagramScale.invert(60); //50, get the domain value from the range
```

- Important: `scaleDiagram` is a function! _Functions are values_, and in the `linearScale()` function returns a function as its result (instead of a string or an array).

- We "set" the domain and range for the resulting function by calling the `domain()` and `range()` functions on it respectively. These functions take in an array of two or more values which are used to specify "stops" where a particular domain value will map to a particular range value. Anything values in between these values will be [linearly interpolated](https://en.wikipedia.org/wiki/Linear_interpolation) (hence the "linear scale").

Note that it is also possible to use _colors_ as range values, producing a nice [gradient](https://en.wikipedia.org/wiki/Color_gradient):

```js
var scaleColor = d3.scaleLinear()
                     .domain([-100, 0, 100])
                     .range(['red', 'white', 'green']);  //using named colors

scaleColor(100);  //rgb(0, 128, 0), or green
scaleColor(0);    //rgb(255, 255, 255), or white
scaleColor(-50);  //rgb(255, 128, 128), or pink (between red and white)
```

It is also possible to specify more options for a scale function by calling additional methods on it. For example, `clamp()` will make sure a domain value doesn't go outside the range, and `nice()`

- Note that you can use the `d3.min()` and `d3.max()` helper methods to perform a **reducing** operating on an array to get its minimum or maximum value (similar to the Python functions). This is useful when specify the domain values to be dependet.

D3 also supports creating non-linear scaling functions. For example, `d3.scaleLog()` will produce a logarithmic mapping, `d3.saleOrdinal()` will produce an [ordinal](https://en.wikipedia.org/wiki/Ordinal_data) mapping. See [the documentation](https://github.com/d3/d3-scale) for a complete list of options.


### Axes

<!-- #### Margins -->





.
