
const container = d3.select('#scrolly-side');
var figure = container.select('figure');
var article = container.select('article');
const stepSel = article.selectAll('.step');

$(document).ready(function () {
	var margin, svg;
	var oldwidth = $(window).width();
	var w = parseInt(d3.select('#my_dataviz').style('width'));
	var h = parseInt(d3.select('#my_dataviz').style('height'));

	if ($(window).width() < 450) {
		var margin = {top: .1 * h, right: .1 * w, bottom: .1 * h, left: .1 * w},
			width = w - margin.left - margin.right,
	    	height = h - margin.top - margin.bottom;

		// append the svg object to the body of the page
		svg = d3.select("#my_dataviz")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)

			.append("g")
			.attr("transform",
				"translate(" + "0" + "," + "0" + ")");

		d3.selectAll("svg")
			.style("background-color", "#2B2F77");
	}	
	else {
		// set the dimensions and margins of the graph
		var margin = { top: 30, right: 80, bottom: 30, left: 80 },
			width = window.innerWidth * 0.8 - margin.left - margin.right,
			height = window.innerHeight * 0.8 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		svg = d3.select("#my_dataviz")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)

			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

		d3.selectAll("svg")
			.style("background-color", "#2B2F77");
	}

	render(margin, svg, width, height);

	if ($(window).width() < 450) {
		d3.selectAll('svg').attr("transform", "rotate(90)");
		//d3.selectAll('g.tick').attr("transform", "rotate(-90)");
	}

});


function render(margin, svg, width, height) {
	d3.csv("sl.csv", function (data) {

		// X axis: scale and draw:
		var x = d3.scaleLinear()
			.domain([0, 24])
			.range([0, width]);

		let xAxisGenerator = d3.axisBottom(x);
		xAxisGenerator.ticks(25);
		xAxisGenerator.tickSize(0);
		xAxisGenerator.tickPadding(8);

		let tickLabels = ['00:00', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24:00 GMT+9'];
		xAxisGenerator.tickFormat((d, i) => tickLabels[i]);

		let xAxis = svg.append("g")
			.call(xAxisGenerator)
			.attr("transform", "translate(0," + height + ")");

		xAxis.selectAll(".tick text")
			.attr("fill", "#D2D2D2")
			.attr("font-size", "13")
			.attr("font-family", "Roboto");

		xAxis.select(".tick:nth-child(26)")
			.selectAll("text")
			.attr("dx", "25");

		// Y axis: initialization
		var y = d3.scaleLinear()
			.range([height, 0]);

		let yAxisGenerator = d3.axisLeft(y);
		yAxisGenerator.tickSize(-width);
		yAxisGenerator.tickPadding(8);

		let yAxis = svg.append("g");

		yAxis.selectAll(".domain").remove()

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
				.filter(function (d) {
					if (+d.npbysem == index) {
						console.log(+d.np)
						return d.hour;
					}
				})

			// set the parameters for the histogram
			var histogram = d3.histogram()
				.value(function (d) { return d.hour; })   // I need to give the vector of value
				.domain(x.domain())  // then the domain of the graphic
				.thresholds(x.ticks(24)); // then the numbers of bins

			// And apply this function to data to get the bins
			var bins = histogram(datanew);

			// Y axis: update now that we know the domain
			if (index == 3) {
				y.domain([0, 50]);
				let tickLabels = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50 classes'];
				yAxisGenerator.tickFormat((d, i) => tickLabels[i]);
			}
			else if (index == 4) {
				y.domain([0, 450]);
				let tickLabels = ['0', '50', '100', '150', '200', '250', '300', '350', '400', '450 classes'];
				yAxisGenerator.tickFormat((d, i) => tickLabels[i]);
			}
			else {
				y.domain([0, 45]);
				let tickLabels = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45 classes'];
				yAxisGenerator.tickFormat((d, i) => tickLabels[i]);
			}   // d3.hist has to be called before the Y axis obviously

			yAxis
				.transition()
				.duration(1000)
				.call(yAxisGenerator);

			yAxis
				.selectAll("g path")
				.attr("opacity", "0");

			yAxis
				.selectAll(".tick text")
				.attr("fill", "#D2D2D2")
				.attr("font-size", "13");

			yAxis
				.selectAll(".tick line")
				.attr("stroke", "#D2D2D2");

			// Join the rect with the bins data
			var u = svg.selectAll("rect")
				.data(bins)

			// Manage the existing bars and eventually the new ones:
			u
				.enter()
				.append("rect") // Add a new rect for each new elements
				.merge(u) // get the already existing elements as well
				.transition() // and apply changes to all of them
				.duration(1000)
				.attr("x", 1)
				.attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
				.attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
				.attr("height", function (d) { return height - y(d.length); })
				.style("fill", "#5168A6")
				.attr("opacity", "90%")
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
				offset: 0.67,
				debug: false
			})
				.onStepEnter(handleStepEnter)

			// setup resize event
			window.addEventListener('resize', handleResize);

		}

		init()
	});
}











