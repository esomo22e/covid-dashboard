<script>
	import { onMount } from 'svelte';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
	import { select, mouse } from 'd3-selection';
import { timeParse, timeFormat } from 'd3-time-format';
	import { line, curveMonotoneX, curveNatural } from 'd3-shape';
	import { path } from 'd3-path';
	import { interpolateRound } from 'd3-interpolate';
	import 'd3-transition'
	import { legendColor } from 'd3-svg-legend';
	import { colors } from '../helpers/colors.js'

	let d3 = {
		scaleLinear: scaleLinear,
		scaleBand: scaleBand,
		select: select,
		mouse: mouse,
		axisLeft: axisLeft,
		axisRight: axisRight,
		axisBottom: axisBottom,
		axisTop: axisTop,
		line: line,
		path: path,
		curveMonotoneX: curveMonotoneX,
		curveNatural: curveNatural,
		interpolateRound: interpolateRound,
		legendColor: legendColor
	}

	let el;

	const padding = { top: 50, right: 0, bottom: 15, left: 40 };



		export let data = {data};
		export let width = {width};
		export let height = {height};
		export let xVar = {xVar};
		export let yVar = {yVar};
		export let yA = {yA};
		export let yB = {yB};
		export let yC = {yC};

		export let avgdaycount = 7;

		// data.forEach(function(d,i){
		// 	if (i > (avgdaycount-2)) {
		// 		let array = [];
		// 		for (let j=0;  j<avgdaycount; j++) {
		// 			array.push( +data[i-j][yVar] )
		// 		}
		// 		let avg = array.reduce((a, b) => a + b, 0) / avgdaycount;
		// 		data[i]["rollingavg"] = Math.round(avg);
		// 	}
		// })

	$: xScale = d3.scaleBand()
		.domain(data.map(function(o) { return o[xVar]; }))
		.rangeRound([0, width - padding.left - padding.right])
		.padding(0.1);

	$: yScale = d3.scaleLinear()
		.domain([0, Math.max.apply(Math, data.map(function(o) { return o[yVar]; }))])
		.range([height - padding.bottom, padding.top])
    	.nice();

	function showTip(d, target, mouse) {
		target
		  .style("position", "absolute")
		  .style("left", mouse[0] + "px")
		  .style("top", mouse[1] - 90 + "px")
		  .style("display", "inline-block")
		  .html(
			  "<h4>" + d[xVar] + "</h4>" +
			  yB + ": " + d[yB] + "<br/>" +
			  yC + ": " + d[yC] + "<br/>" +
			  yA + ": " + d[yA] + "<br/>"
			);
	}

	onMount(generateBarChart);

	function generateBarChart() {

		var tooltip = d3.select(el).append("div").attr("class", "tooltip");

		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform",
				  "translate(" + padding.left + "," + 0 + ")");

		svg.append("g")
		   .attr("transform", "translate(0," + (height-padding.bottom) + ")")
		   .call(d3.axisBottom(xScale).tickSize(0))
			.selectAll("text")
	        .style("text-anchor", "middle")
	        // .attr("dx", "-.4em")
	        // .attr("dy", ".15em");
	        // .attr("transform", "rotate(-60)");

		svg.append("g")
  			.call(d3.axisLeft(yScale));

		// add data columns
		// positive
		svg.append('g')
	    .selectAll("rect")
	    .data(data)
	    .enter()
	    .append("rect")
		 .attr("fill", colors(yA))
		 .attr("x", function (d) { return xScale(d[xVar]); })
	    .attr("y", function (d) { return yScale(d[yA]); })
		 .attr("width", xScale.bandwidth())
		 .attr("height", function(d) { return height - padding.bottom - yScale(d[yA]) })
		 .on("mousemove", function(d){
            showTip(d, tooltip, d3.mouse(this))
        })
    	  .on("mouseout", function(d){
			  tooltip.style("display", "none")
		  });

		  // negative
		 svg.append('g')
 	    .selectAll("rect")
 	    .data(data)
 	    .enter()
 	    .append("rect")
		 .attr("fill", colors(yB))
 		 .attr("x", function (d) { return xScale(d[xVar]); })
 	    .attr("y", function (d) {
			 return yScale(+d[yB] + +d[yA])
		 })
 		 .attr("width", xScale.bandwidth())
 		 .attr("height", function(d) { return height - padding.bottom - yScale(d[yB]) })
		 .on("mousemove", function(d){
            showTip(d, tooltip, d3.mouse(this))
        })
    	  .on("mouseout", function(d){
			  tooltip.style("display", "none")
		  });
		//
		//   // inconclusive
  		svg.append('g')
  	    .selectAll("rect")
  	    .data(data)
  	    .enter()
  	    .append("rect")
  		 .attr("fill", colors(yC))
  		 .attr("x", function (d) { return xScale(d[xVar]); })
  	    .attr("y", function (d) {
			 return yScale(+d[yC] + +d[yB] + +d[yA])
		 })
  		 .attr("width", xScale.bandwidth())
  		 .attr("height", function(d) { return height - padding.bottom - yScale(d[yC]) })
  		 .on("mousemove", function(d){
              showTip(d, tooltip, d3.mouse(this))
          })
      	  .on("mouseout", function(d){
  			  tooltip.style("display", "none")
  		  });

		  svg.append("g")
		    .attr("class", "legendOrdinal")
		    .attr("transform", "translate(" + (-padding.left/2 - 0) + "," + 0 + ")");

		  var legendOrdinal = d3.legendColor()
		  	 .scale(colors)
			 .orient("horizontal")
		  	 .shape("rect")
			 .shapeWidth(3 * (width/15))
			 .shapePadding(2 * width/15)
			 .shapeHeight(10);

		  svg.select(".legendOrdinal")
		    .call(legendOrdinal);

		 // svg.append("path")
       //  .datum(data.filter(function(d,i){
			//   return i > (avgdaycount-2)
		 //  }))
       //  .attr("fill", "none")
		 //  .attr("stroke", "#d51e2d")
       //  .attr("stroke-width", 5)
       //  .attr("d", d3.line()
		 //  	 .curve(d3.curveNatural)
       //    .x(function(d) { return xScale(d[xVar]) + (xScale.bandwidth()/2); })
       //    .y(function(d) { return yScale(d["rollingavg"]); })
      	// )
	}
</script>

<style>
	.chart :global(rect) {
		/* fill: #cfbabc; */
	}

	.chart :global(.tooltip) {
		display:none;
		position: absolute;
		background-color: white;
		border:2px solid black;
		border-radius:10px;
		padding: 10px;
		width:200px;
	}

	.chart :global(.legendCells .cell) {
		font-size:0.65rem;
		fill: #777;
		text-transform:uppercase;
	}
</style>

<div bind:this={el} class="chart"></div>
