<script>
	import { onMount } from 'svelte';
	import { scaleOrdinal } from 'd3-scale';
	import { select, mouse } from 'd3-selection';
	import { entries } from 'd3-collection';
	import { path } from 'd3-path';
	import { pie, arc } from 'd3-shape';
	import { colors } from '../helpers/colors.js'

	let d3 = {
		scaleOrdinal: scaleOrdinal,
		entries: entries,
		pie: pie,
		arc: arc,
		select: select,
		mouse: mouse,
		path: path,
	}

	let el;

	const padding = { top: 10, right: 40, bottom: 70, left: 50 };



	export let data = {data};
	export let width = {width};
	export let height = {height};

	data = data[data.length-1]


	// function showTip(d, target, mouse) {
	// 	target
	// 	  .style("position", "absolute")
	// 	  .style("left", mouse[0] + "px")
	// 	  .style("top", mouse[1] - 90 + "px")
	// 	  .style("display", "inline-block")
	// 	  .html(
	// 		  "<h4>" + d[xVar] + "</h4>" +
	// 		  "Samples taken: " + d[yVar] + "<br/>" +
	// 		  "Tests completed: " + d[yA] + "<br/>" +
	// 		  "Tests in progress: " + d[yB] + "<br/>"
	// 		);
	// }

	onMount(generateDonut);

	function generateDonut() {

		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height + 75)
			.append("g")
			.append("g")
      	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


			// Create dummy data
		var donutdata = {a: data["Tests Completed"], b: data["Positive Tests"]}

		// set the color scale
		var color = d3.scaleOrdinal()
		  .domain(donutdata)
		  .range(["#CFC7BF", "#D41B2C"])

		// Compute the position of each group on the pie:
		var pie = d3.pie()
		  .value(function(d) {return d.value; })
		var data_ready = pie(d3.entries(donutdata))

		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
		svg
		  .selectAll('whatever')
		  .data(data_ready)
		  .enter()
		  .append('path')
		  .attr('d', d3.arc()
		    .innerRadius(width * 0.2)         // This is the size of the donut hole
		    .outerRadius(width * 0.5)
		  )
	  	.attr('fill', function(d){ return(color(d.data.key)) })

		var donutcaption = svg.append("text")
			.attr("text-anchor", "middle")
			.attr("x", -32)
			.attr("y", (height/2) + 25)

		donutcaption.append("tspan")
			.text("Positive rate as of " + data["Date"] + ": ")

		donutcaption.append("tspan")
			.attr("dx", -125)
			.attr("dy", 30)
			.attr("font-size", "1.5rem")
			.attr("fill", "#D41B2C")
			.attr("font-weight", "900")
			.text((data["Positive Tests"] / data["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))
	}
</script>

<style>


	.chart :global(.tooltip) {
		display:none;
		position: absolute;
		background-color: white;
		border:2px solid black;
		border-radius:10px;
		padding: 10px;
		width:200px;
	}
</style>

<div bind:this={el} class="chart"></div>
