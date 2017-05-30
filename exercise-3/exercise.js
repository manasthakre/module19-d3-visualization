'use strict';
//d3 has already been "imported"

//size of the margins
var SVG_SIZE = {width: 600, height:480}
var MARGIN_SIZE = {
  left:70,
  bottom:70,
  top:50,
  right:50
}

var svg = d3.select('svg')
  .attr('width', SVG_SIZE.width).attr('height', SVG_SIZE.height);

//Use the SVG_SIZE and MARGIN_SIZE values to calculate the `width` and `height` 
//of the displayable area of the plot (where the circles will go)
var displayWidth = SVG_SIZE.width - MARGIN_SIZE.left - MARGIN_SIZE.right; 
var displayHeight = SVG_SIZE.height - MARGIN_SIZE.bottom - MARGIN_SIZE.top;
//console.log(displayWidth, displayHeight);


//Use the `d3.csv()` function to ASYNCHRNOUSLY load the `data/WDI_2014_cleaned.csv` 
//file. When the data finishes loading, execute the rest of your code.
//Note that the asynchronous callback function takes two arguments: an error 
//(if there is one) and the data---the data will be the second argument.
d3.csv('data/WDI_2014_cleaned.csv', function(err, data){

    //Log out the data once it is received to confirm that it is loaded correctly.
    console.log(data);

    //Calculate the minimum and maximum values for the `life_expectancy` and `gdp`
    //columns in the data. Hint: use `d3.min()` and `d3.max()`. You will need to
    //use `parseFloat()` to convert String values into numbers
    //Log out the values to test them 
    //(GDP goes from ~152 to ~82923, LE from ~49 to ~84)
    var minGDP = d3.min(data, function(d){return parseFloat(d.gdp)});
    var maxGDP = d3.max(data, function(d){return parseFloat(d.gdp)});
    var minLE = d3.min(data, function(d){return parseFloat(d.life_expectancy)});
    var maxLE = d3.max(data, function(d){return parseFloat(d.life_expectancy)});
    console.log(minGDP, maxGDP, minLE, maxLE); 

    //Create a scale for the y values. This should be a _linear_ scale whose domain
    //is the data's life expectancy values, and whose range is the height of the
    //displayable area.
    //NOTE: your range will need to go from the `height` to 0 (so that the axis is
    //"inverted")
    var yScale = d3.scaleLinear()
        .domain([minLE*.95, maxLE])
        .range([displayHeight,0]);

    //Create a scale for the x values. This should be a _logarithmic_ scale whose
    //domain is the data's GDP values, and whose range is the width of the
    //displayable area
    var xScale = d3.scaleLog()
        .domain([minGDP*.9, maxGDP])
        .range([0, displayWidth]);


    //Append a <g> element in which to place the plotted circles
    //Use the `transform`, `width`, and `height` attributes to size this
    //based on the MARGIN and displayable dimensions
    //Save this element as the `plot`.
    var plot = svg.append('g')
        .attr('transform','translate('+MARGIN_SIZE.left+', '+MARGIN_SIZE.top+')')
        .attr('width', displayWidth)
        .attr('height', displayHeight)
    
    //Select all of the <circle> elements in the `plot` group and join them with
    //the loaded data.
    var circles = plot.selectAll('circle').data(data);

    //Add a new circle for each entering element, with the following attributes:
    //  `cx` (center-x) of the country's `gdp` scaled by the x-scale
    //  `cy` (center-y) of the country's `life_expectancy` scaled by the y-scale
    //  `r` (radius) of 10
    //  `fill` that is 'blue'
    //  `opacity` of 0.3 (use the `style()` method!)
    circles.enter().append('circle')
        .attr('cx', function(d){return xScale(d.gdp)})
        .attr('cy', function(d){return yScale(d.life_expectancy)})
        .attr('r', 10)
        .attr('fill', 'blue')
        .style('opacity',0.3)

    //Define an bottom axis for the x-scale. Give it 5 tick mark values 
    //using `",i"` as a format option (grouped integers)
    var xAxis = d3.axisBottom(xScale).ticks(5, ',i');

    //Append a <g> element to the svg to contain the xAxis. Use the `transform`
    //attribute to `translate()` the element to below the display area.
    //Then `call()` the x-axis to add it to the visualization
    svg.append('g')
        .attr('transform','translate('+MARGIN_SIZE.left+','+(displayHeight+ MARGIN_SIZE.top)+')')
        .call(xAxis);

    //Define a left axis for the y-scale. Give it `tickFormat()` of 
    //`d3.format('.2s')` (2 digits with SI prefixes)
    var yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2s'));

    //Append a <g> element to the svg to contain the yAxis. Use the `transform`
    //attribute to `translate()` the element to the left of the display area.
    //Then `call()` the y-axis to add it to the visualization
    svg.append('g')
        .attr('transform','translate('+MARGIN_SIZE.left+','+(MARGIN_SIZE.top)+')')
        .call(yAxis);

    //BONUS: Add <text> elements as with axis titles!
    svg.append('text')
        .text('GDP in 2014 (2005 USD)')
        .attr('transform', 'translate('+(MARGIN_SIZE.left + displayWidth/3)+','+(displayHeight + MARGIN_SIZE.top + 40)+')')
    svg.append('text')
        .text('Life Expectancy in 2014')
        .attr('transform', 'translate('+(MARGIN_SIZE.left - 40)+','+(MARGIN_SIZE.top + 2*displayHeight/3 + 40)+') rotate(-90)')

});
