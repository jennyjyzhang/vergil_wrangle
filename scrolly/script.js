const container = d3.select('#scrolly-side');
var figure = container.select('figure');
var article = container.select('article');
const stepSel = article.selectAll('.step');

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = window.innerWidth * 0.65,
    height = window.innerHeight * 0.8 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("graphic.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d){return(d.npbysem)}).keys()

	// X axis: scale and draw:
	var x = d3.scaleLinear()
	    .domain([0, 24])     
	    .range([0, width]);
	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	// Y axis: initialization
	var y = d3.scaleLinear()
	    .range([height, 0]);
	var yAxis = svg.append("g")				

	// instantiate the scrollama
	const scroller = scrollama();

	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepH = Math.floor(window.innerHeight * 0.2);
		stepSel.style('height', stepH + 'px');

		var figureHeight = window.innerHeight / 1.25
		var figureMarginTop = (window.innerHeight - figureHeight) / 2  
		figure
			.style('height', figureHeight + 'px')
			.style('top', figureMarginTop + 'px');
		// 3. tell scrollama to update new element dimensions
		scroller.resize();
	}

	// scrollama event handlers
	function handleStepEnter(response) {
		console.log(response)
		updateChart(response.index)
	}

	function updateChart(index) {
	    //filter data by semester
	    var datanew = data
	      .filter(function(d){ if (+d.npbysem == index){
	      		console.log(+d.np)
	          return d.hour;
	        }
	      })

	    // set the parameters for the histogram
	    var histogram = d3.histogram()
	      .value(function(d) { return d.hour; })   // I need to give the vector of value
	      .domain(x.domain())  // then the domain of the graphic
	      .thresholds(x.ticks(24)); // then the numbers of bins

	    // And apply this function to data to get the bins
	    var bins = histogram(datanew);

	    // Y axis: update now that we know the domain
	    if ((index == 3) || (index == 4)) { y.domain([0, 450]); }
	    else { y.domain([0, 45]); }   // d3.hist has to be called before the Y axis obviously

	    yAxis
	        .transition()
	        .duration(600)
	        .call(d3.axisLeft(y));

	    // Join the rect with the bins data
	    var u = svg.selectAll("rect")
	        .data(bins)

	    // Manage the existing bars and eventually the new ones:
	    u
	        .enter()
	        .append("rect") // Add a new rect for each new elements
	        .merge(u) // get the already existing elements as well
	        .transition() // and apply changes to all of them
	        .duration(600)
	          .attr("x", 1)
	          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
	          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
	          .attr("height", function(d) { return height - y(d.length); })
	          .style("fill", "#69b3a2")
	}
	

	function init() {
		Stickyfill.add(d3.select('.sticky').node());

		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();

		// 2. setup the scroller passing options
		// this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			step: '#scrolly-side article .step',
			offset: 0.5,
			debug: true
		})
		.onStepEnter(handleStepEnter)

		// setup resize event
		window.addEventListener('resize', handleResize);

	}

	init()
});