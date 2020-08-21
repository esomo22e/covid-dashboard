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


	function showPctTip(d, target, mouse) {
		target
		  .style("position", "absolute")
		  .style("left", (mouse[0] + document.getElementById('covid-testing-dashboard').offsetLeft + 500) + "px")
		  .style("top", (mouse[1] + document.getElementById('covid-testing-dashboard').offsetTop + 275) + "px")
		  .style("display", "inline-block")
		  .html(
			  "<div class='tipdate'>" + data["Date"] + "</div>" +
			  "Negative rate: " + (data["Negative Tests"] / data["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + "<br/>" +
			  "Inconclusive rate: " + (data["Inconclusive Tests"] / data["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + "<br/>" +
			  "Positive rate: " + (data["Positive Tests"] / data["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + "<br/>"
			);
	}

	onMount(generateDonut);

	function generateDonut() {



		var tooltip = d3.select(el).append("div").attr("class", "pcttooltip");

		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.append("g")
      	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


			// Create dummy data
		var donutdata = {a: data["Positive Tests"], b: data["Negative Tests"], c: data["Inconclusive Tests"]}

		// set the color scale
		var color = d3.scaleOrdinal()
		  .domain(donutdata)
		  .range([
	           "#D41B2C",
	           "#88c7f0",
	           "#FF854F"
	     ])

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
		  .on("mousemove", function(d){
			    if (window.innerWidth > 600) {
             	showPctTip(d, tooltip, d3.mouse(this))
				}
         })
     	  .on("mouseout", function(d){
 			  tooltip.style("display", "none")
 		  });

		var donutcaption = d3.select(el)
			.append("div")
			.style("text-align", "center")
			.style("margin", "15px auto")


		donutcaption.append("div")
			.style("font-size", "1rem")
			.style("line-height", "1.25rem")
			.text("Percentage of positive test results at Northeastern on " + data["Date"] + ": ")

		donutcaption.append("div")
			.style("font-size", "1.5rem")
			.style("color", "#D41B2C")
			.style("font-weight", "700")
			.style("margin-bottom", "1rem")
			.text((data["Positive Tests"] / data["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))

		donutcaption.append("div")
			.style("line-height", "1rem")
			.style("font-size", "0.84rem")
			.text("Massachusetts 7-day average on " + data["Date"] + ": ")

		donutcaption.append("div")
			.style("font-size", "1.2rem")
			.style("color", "#333")
			.style("font-weight", "700")
			.text((data["Mass. Positive Rate"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))
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
