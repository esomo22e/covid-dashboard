<script>
	import { onMount } from 'svelte';
	import { scaleOrdinal } from 'd3-scale';
	import { select, mouse } from 'd3-selection';
	import { entries } from 'd3-collection';
	import { path } from 'd3-path';
	import { pie, arc } from 'd3-shape';
	import { negativePositive } from '../helpers/colors.js'

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

	const padding = { top: 0, right: 0, bottom: 0, left: 0 };
	export let data = {data};
	export let width = {width};
	export let height = {height};

	data = data[data.length-1] // only use latest day's data


	onMount(generateDonut);

	function generateDonut() {
		// var tooltip = d3.select(el).append("div").attr("class", "pcttooltip");

		var donutcaption = d3.select(el)
			.append("div")
			.attr("class", "donut-title")
			.style("text-align", "center")

		donutcaption.append("div")
			.style("font-size", "1.5rem")
			.style("color", "#6e016b")
			.style("font-weight", "700")
			.style("margin-bottom", "0rem")
			.text(function(d){

				return "Students"
			})
		// 	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.append("g")
      	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		// var donutdata = {a: data["Seven-Day Positive"], b: data["Seven-Day Negative"]}
		var donutdata = {a: data["Students Total Positive"], b: data["Students Total Negative"]}

		var color = d3.scaleOrdinal()
		  .domain(donutdata)
		  .range(["#6e016b", "#9ebcda"])

		  // .range(negativepositive.reverse())

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
		.text((data["Students Total Positive"] ).toLocaleString())
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
    .chart {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
    }
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
