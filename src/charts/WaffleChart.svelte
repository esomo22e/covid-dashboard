<script>
	import { onMount } from 'svelte';
	import { scaleLinear, scaleBand, scaleOrdinal, scaleQuantize, scaleThreshold, scaleQuantile } from 'd3-scale';
	import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
	import { select } from 'd3-selection';
	import { transition } from 'd3-transition'
	import { legendColor, legendSize } from 'd3-svg-legend';
	import { vibrant } from '../helpers/colors.js'

	let d3 = {
		scaleLinear: scaleLinear,
		scaleBand: scaleBand,
		scaleOrdinal: scaleOrdinal,
		scaleQuantize: scaleQuantize,
		scaleQuantile: scaleQuantile,
		scaleThreshold: scaleThreshold,
		select: select,
		axisLeft: axisLeft,
		axisRight: axisRight,
		axisBottom: axisBottom,
		axisTop: axisTop,
		legendColor: legendColor,
		legendSize:legendSize
	}

	let el;

	const padding = { top: 20, right: 0, bottom: 0, left: 20 };



	export let data = [];
	export let width = {width};
	export let groups = {groups};
	export let columns = {columns};
	export let colorscheme = vibrant;
	export let orientation = "horizontal";

	export let thresholds = [0]
	export let total;

	for (let g in groups) {
		total = data[groups[g]] + thresholds[thresholds.length-1];
		thresholds.push(total)
	}


	export let squaresize = Math.floor(width / columns) - 1;
	// export let squaresize = 30
	$: rows = Math.ceil(total/columns)
	// $: rows = Math.ceil(columns);
	$: height = (rows * (squaresize+1)) * 1.25
	// $: height = rows/1.5  * (squaresize+1)

	$: xScale = d3.scaleLinear()
		.domain([0, total])
		.range([0, columns * squaresize]);

	$: colorScale = d3.scaleQuantile()
		.domain(thresholds)
		.range(colorscheme.splice(0, thresholds.length-1));

	onMount(generateWaffleChart);

	function generateWaffleChart() {
		let svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height + padding.top);

		let gviz = svg.append("g")
			.attr("transform",
			  "translate(" + padding.left + "," + padding.top + ")")

		gviz.append("text")
		.style("fill", "#6e016b")
		.style("font-size", "1.5rem")
		.style("font-weight", "700")
		// .attr("text-anchor", "middle")
		.text(total + " cases")


			for (let i=0; i < total; i++) {

				console.log(total)



				gviz.append("circle")
					.attr("class", "rect" + i)
					.attr("cx", Math.floor(i / rows) * (squaresize+1))
					.attr("cy", ((i % rows) * (squaresize+1))+40 )
					.attr("r", squaresize/2)

					.attr("fill", 	 colorScale(i))
			}


	} // generateBarChart
</script>

<style>
	.chart :global(text){
		font-family:'akkurat',sans-serif;
		font-size:12px;
		text-transform: uppercase;
	}

	.chart :global(g.tick line) {
		stroke: #ccc;
	}

	.chart :global(.legendContainer) {
		display:block;
		margin:0 auto;
		padding:10px 0;
		border:1px solid #ccc;
		border-radius:3px;
	}

	.chart :global(.legendContainer text) {
		font-family:'akkurat',sans-serif;
		text-transform: uppercase;
		fill: #666;
		font-size: 11px;
	}

	.stats {
		display:grid;
		grid-template-columns: var(--proportions);
		margin:0
	}

	.stats div {
		font-family:'akkurat',sans-serif;
		font-size:11px;
		text-transform: uppercase;
	}

	h3 {
		font-family:'akkurat',sans-serif;
		font-size:1.5rem;
		text-transform: unset;
		margin: 0 auto 1rem;
	}
</style>

<div bind:this={el} class="chart"></div>
