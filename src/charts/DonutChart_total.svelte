<script>
	import { onMount } from 'svelte';
	import { scaleOrdinal } from 'd3-scale';
	import { select, mouse } from 'd3-selection';
	import { entries } from 'd3-collection';
	import { path } from 'd3-path';
	import { pie, arc } from 'd3-shape';
	import { negativepositive } from '../helpers/colors.js'

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

	data = data[data.length-1] // only use latest day's data


	// function showPctTip(d, target, mouse) {
	// 	target
	// 	  .style("position", "absolute")
	// 	  .style("left", (mouse[0] + document.getElementById('covid-testing-dashboard').offsetLeft + 500) + "px")
	// 	  .style("top", (mouse[1] + document.getElementById('covid-testing-dashboard').offsetTop + 670) + "px")
	// 	  .style("display", "inline-block")
	// 	  .html(
	// 		  "<div class='tipdate'>As of " + data["Date"] + ":</div>" +
	// 		  "Negative rate: " + (data["Seven-Day Negative"] / data["Seven-Day Tests"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + "<br/>" +
	// 		  "Positive rate: " + (data["Seven-Day Positive"] / data["Seven-Day Tests"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + "<br/>"
	// 		);
	// }

	onMount(generateDonut);

	function generateDonut() {
		// var tooltip = d3.select(el).append("div").attr("class", "pcttooltip");

		// var donutcaption = d3.select(el)
		// 	.append("div")
		// 	.style("text-align", "center")
		// 	.style("margin", "0 auto 2rem")
		//
		// // donutcaption.append("div")
		// // 	.style("font-size", "1rem")
		// // 	.style("line-height", "1.25rem")
		// // 	.text("7-day average of positive test results at Northeastern: ")
		// //
		// donutcaption.append("div")
		// 	.style("font-size", "1.5rem")
		// 	.style("color", "#D41B2C")
		// 	.style("font-weight", "700")
		// 	.style("margin-bottom", "0rem")
		// 	.text("Students")
		// 	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.append("g")
      	.attr("transform", "translate(" + width / 2.2 + "," + height / 2 + ")");

		var donutdata = {a: data["Total Vaccinated"], b: data["Total Non-Vaccinated"]}

		var color = d3.scaleOrdinal()
		  .domain(donutdata)
		  .range(["#6e016b", "#9ebcda"])

		// Compute the position of each group on the pie:
		var pie = d3.pie()
		  .value(function(d) {return d.value; })
		var data_ready = pie(d3.entries(donutdata))

		var total_vac = data["Total Vaccinated"] + data["Total Non-Vaccinated"];

		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
 		svg
		  .selectAll('whatever')
		  .data(data_ready)
		  .enter()
		  .append('path')
		  .attr('d', d3.arc()
		    .innerRadius(width * 0.35)         // This is the size of the donut hole
		    .outerRadius(width * 0.45)
		  )
	  	  .attr('fill', function(d){ return(color(d.data.key)) })
		  .attr('stroke-width', 0)

		svg.append("text")
		.style("fill", "#6e016b")
		.style("font-size", "1.5rem")
		.style("font-weight", "700")
		.attr("text-anchor", "middle")
		.text((data["Total Vaccinated"] / (total_vac)).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))

		console.log(total_vac)
		// .text((data["Seven-Day Positive"] / data["Seven-Day Tests"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))
		// .style("color", "#D41B2C")

		  // .on("mousemove", function(d){
			//     if (window.innerWidth > 600) {
        //      	showPctTip(d, tooltip, d3.mouse(this))
			// 	}
        //  })
     	  // .on("mouseout", function(d){
 			//   tooltip.style("display", "none")
 		  // });


	}
</script>

<style>
	.chart :global(.tipdate) {
		font-size:1.2rem;
		font-weight:bold;
		margin:0 auto 0.5rem;
	}

	.chart :global(.pcttooltip) {
		display:none;
		position: absolute;
		background-color: white;
		border:2px solid black;
		border-radius:10px;
		padding: 10px;
		width:300px;
	}
</style>

<div bind:this={el} class="chart"></div>
