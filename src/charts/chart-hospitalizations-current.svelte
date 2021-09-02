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

	const padding = { top: 10, right: 40, bottom: 70, left: 50 };

	export let data = {data};
	export let width = {width};
	export let height = {height};

	data = data[data.length-1] // only use latest day's data

	onMount(generateDonut);

	function generateDonut() {
		const svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.append("g")
      	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		let donutdata = {a: data["Hospital"], b: data["Non-hospital"]}

		const color = d3.scaleOrdinal()
		  .domain(donutdata)
		  .range(["#6e016b", "#9ebcda"])

		// Compute the position of each group on the pie:
		var pie = d3.pie()
		  .value(function(d) {return d.value; })
		var data_ready = pie(d3.entries(donutdata))

        // Adds a rectangle behind the number
        let squareSideLength = 0.4 * width
        let squareStrokeWidth = "8px";
        svg.append("rect")
            .attr("width", squareSideLength)
            .attr("height", squareSideLength)
            .attr("x", -0.5 * squareSideLength)
            .attr("y", -0.5 * squareSideLength)
            .style("fill", "transparent")
            .style("stroke", "#9ebcda")
            .style("stroke-width", squareStrokeWidth)

        let textFontSizeAmount = 1.5;
		let textFontSizeUnit = "rem";
		let textOffsetY = 0.4 * textFontSizeAmount;

		svg.append("text")
		.style("fill", "#6e016b")
		.style("font-size", textFontSizeAmount + textFontSizeUnit)
		.style("transform", `translateY(${textOffsetY}${textFontSizeUnit})`)
		.style("font-weight", "700")
		.attr("text-anchor", "middle")
		.text((data["Hospital"]).toLocaleString())
	}
</script>

<style>
    .chart {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: row;
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
