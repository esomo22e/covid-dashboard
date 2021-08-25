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
		console.log(rows)
		console.log(height);
		console.log(total)
		let svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height + padding.top);

		let gviz = svg.append("g")
			.attr("transform",
			  "translate(" + padding.left + "," + padding.top + ")")


		// for (let i=0; i < total; i++) {
		// 	gviz.append("circle")
		// 		.attr("class", "circle" + i)
		// 		.attr("cy", 		Math.floor(i / rows) * (squaresize+1))
		// 		.attr("cx", 		(i % rows) * (squaresize+1))
		// 		.attr("r", squaresize/2)
		// 		// .attr("r",  squaresize)
		// 		.attr("fill", 	 colorScale(i))
		// }





		// let svg = d3.select(el)
		// 		.append("svg")
		// 		.attr("width", width)
		// 		.attr("height", height + padding.top);
		//
		// 	let gviz = svg.append("g")
		// 		.attr("transform",
		// 		  "translate(" + padding.left + "," + padding.top + ")")
		//
		//
		gviz.append("text")
		.style("fill", "#6e016b")
		.style("font-size", "1.5rem")
		.style("font-weight", "700")
		// .attr("text-anchor", "middle")
		.text(total + " cases")

		// const legend1 = d3.legendColor()
		// 	.scale(colorScale)
		// 	.orient("horizontal")
		// 	.shapeWidth((width)/4)
		// 	.shapePadding(120/4)
		// 	.labelWrap((width)/4)
		//
		// 	const legendContainer1 = gviz.append("svg")
		// 	.attr("width", width)
		// 	.attr("class","legendContainer1")
		// 	.attr("height", function(d){
		// 		if( width > 600){
		// 			return 80;
		//
		// 		}
		// 		else{
		// 			return 70;
		// 		}
		// 	})
		// 	.append("g")
		// 	.attr("transform", "translate(" + (width/4)  + ",0)")
		// 	.call(legend1)


			for (let i=0; i < total; i++) {

				console.log(total)



				gviz.append("circle")
					.attr("class", "rect" + i)
					.attr("cx", Math.floor(i / rows) * (squaresize+1))
					.attr("cy", ((i % rows) * (squaresize+1))+40 )
					.attr("r", squaresize/2)

					.attr("fill", 	 colorScale(i))
			}


		// if (width >= 750) {
		// 	let glabels = svg.append("g")
		// 		.selectAll("text")
		// 		.data(groups)
		// 		.enter()
		// 		.append("text")
		// 		.text(function(d,i){
		// 			return d + ": " + data[d]
		// 		})
		// 		.attr("x", function(d,i){
		// 			let number = [0, ((thresholds[1] + thresholds[2]) / 2), thresholds[3]]
		// 			return xScale(number[i])
		// 		})
		// 		.attr("y", 12)
		// 		.attr("fill", "black")
		// 		.attr("text-anchor", function(d,i) {
		// 			return ["start", "middle", "end"][i]
		// 		})
		// }







		// const legend = d3.legendColor()
		// 	.scale(colorScale)
		// 	.orient("horizontal")
		// 	.shapeWidth(40)
		// 	.shapePadding(60)
		// 	.labelWrap(80)
		//
		// const legendContainer = d3.select(el).append("svg")
		// 	.attr("width",
		// 		(
		// 			(colorScale.domain().length * 40) + (colorScale.domain().length * 60)
		// 		)
		// 	)
		// 	.attr("class","legendContainer")
		// 	.attr("height", 50)
		// 	.append("g")
		// 	.attr("transform", "translate(" + (padding.left + (10))  + ",0)")
		// 	.call(legend)

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
