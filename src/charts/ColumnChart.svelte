<script>
	import { onMount } from 'svelte';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
	import { select } from 'd3-selection';
import { timeParse, timeFormat } from 'd3-time-format';
	import { line, curveMonotoneX, curveNatural } from 'd3-shape';
	import { path } from 'd3-path';
	import { interpolateRound } from 'd3-interpolate';

	let d3 = {
		scaleLinear: scaleLinear,
		scaleBand: scaleBand,
		select: select,
		axisLeft: axisLeft,
		axisRight: axisRight,
		axisBottom: axisBottom,
		axisTop: axisTop,
		line: line,
		path: path,
		curveMonotoneX: curveMonotoneX,
		curveNatural: curveNatural,
		interpolateRound: interpolateRound
	}

	let el;

	const padding = { top: 10, right: 40, bottom: 40, left: 50 };



		export let data = {data};
		export let width = {width};
		export let height = {height};
		export let xVar = {xVar};
		export let yVar = {yVar};

		export let avgdaycount = 3;

		console.log(data)

		data.forEach(function(d,i){
			if (i > (avgdaycount-2)) {
				let array = [];
				for (let j=0;  j<avgdaycount; j++) {
					array.push( +data[i-j][yVar] )
				}
				let avg = array.reduce((a, b) => a + b, 0) / avgdaycount;
				data[i]["rollingavg"] = Math.round(avg);
			}
		})

	$: xScale = d3.scaleBand()
		.domain(data.map(function(o) { return o[xVar]; }))
		.rangeRound([0, width - padding.left - padding.right])
		.padding(0.2);

	$: yScale = d3.scaleLinear()
		.domain([0, Math.max.apply(Math, data.map(function(o) { return o[yVar]; }))])
		.range([height - padding.bottom, padding.top])
    	.nice();

	onMount(generateBarChart);

	function generateBarChart() {

		// console.log(
		// 	data.filter(function(d,i){
		// 		return i > 1
		// 	})
		// )

		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform",
				  "translate(" + padding.left + "," + padding.top + ")");

		svg.append("g")
		   .attr("transform", "translate(0," + (height-padding.bottom) + ")")
		   .call(d3.axisBottom(xScale));

		svg.append("g")
  			.call(d3.axisLeft(yScale));

		svg.append('g')
	    .selectAll("rect")
	    .data(data)
	    .enter()
	    .append("rect")
		 .attr("x", function (d) { return xScale(d[xVar]); })
	    .attr("y", function (d) { return yScale(d[yVar]); })
		 .attr("width", xScale.bandwidth())
		 .attr("height", function (d) {
			 return height - padding.bottom - yScale(d[yVar]);
		 });

		 svg.append("path")
        .datum(data.filter(function(d,i){
			  return i > (avgdaycount-2)
		  }))
        .attr("fill", "none")
		  .attr("stroke", "#d51e2d")
        .attr("stroke-width", 5)
        .attr("d", d3.line()
		  	 .curve(d3.curveNatural)
          .x(function(d) { return xScale(d[xVar]) + (xScale.bandwidth()/2); })
          .y(function(d) { return yScale(d["rollingavg"]); })
      	)
	}
</script>

<style>
	.chart :global(rect) {
		fill: #cfbabc;
	}
</style>

<div bind:this={el} class="chart"></div>
