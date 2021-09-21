<script>
	import { onMount } from 'svelte';
	import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
	import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
	import { format } from 'd3-format';
	import { select } from 'd3-selection';
	import { vibrant } from '../helpers/colors.js'
	// import { wrapLabel } from '../helpers/wrapLabel.js'
	import { legendColor } from 'd3-svg-legend';

	let d3 = {
		scaleLinear: scaleLinear,
		scaleBand: scaleBand,
		scaleOrdinal: scaleOrdinal,
		select: select,
		axisLeft: axisLeft,
		axisRight: axisRight,
		axisBottom: axisBottom,
		axisTop: axisTop,
		format: format,
		legendColor: legendColor

	}

	let el;

	const padding = { top: 10, right: 0, bottom: 50, left: 10 };



	export let data = {data};
	export let width = {width};
	export let height = {height};
	export let xVar = {xVar};
	export let yVar = {yVar};
	export let yGroups = {yGroups};
	export let colorsteps = yGroups.length;
	export let len = data.length;
	export let yDomain = ([0, 100])
	export let colorscheme = vibrant;
	export let orientation = "horizontal";

	// TODO: Remove this clumsy patch when it can handle data better
    data = [data[data.length-1]];

	if (Array.isArray(yVar)) {
		yVar = yVar
	} else {
		yVar = [yVar]
	}

	$: xScale = d3.scaleBand()
		.domain(data.map(function(o) { return o[xVar]; }))
		.rangeRound([0, width - padding.left - padding.right])
		.padding(0.2);

	$: yScale = d3.scaleLinear()
		.domain(yDomain)
		.range([height - padding.bottom, padding.top])
		.nice();

	$: colorScale = d3.scaleOrdinal()
	.domain(yGroups)
	.range(colorscheme)
		// .domain(data.map(function(o) { return o[xVar]; }))
		// .range(colorscheme);

	onMount(generateStackedColumn);

	function generateStackedColumn() {
		if (orientation !== "vertical") {
			padding.top = 0;
			padding.left = 75;
			padding.right = 15;
			if (xVar === "protest") {
				padding.left = 180
			}
			xScale.rangeRound([padding.top, height - padding.bottom])
			yScale.range([0, width - padding.left - padding.right])
		}

		// let tooltip = d3.select(el).append("div")
		// 	 .attr("class", "tooltip")
		//  tooltip.append("span")
		// 	 .attr("class", "part1")
		// 	 .text("TESTING")

		// draw chart SVG
		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)


			.attr("height", 80)
			.append("g")
			.attr("transform",
				  "translate(" + 20+ "," + padding.top + ")");




				  if (orientation !== "vertical") {


								// svg.append("div")
								// 	.style("font-size", "1.5rem")
								// 	.style("color", "#6e016b")
								// 	.style("font-weight", "700")
								// 	.style("margin-bottom", "0rem")
								// 	.text("Students")



								// add data columns
								for (let i=0; i<yGroups.length; i++) {




								 	svg.append('g')
										.selectAll("rect")
										.data(data)
										.enter()
									.append("rect")
									.attr("fill", colorScale(yGroups[i]))
									.attr("x", function(d){
											let barheight = 0;
											for (let j=i; j>-1; j = j-1) {
												barheight += d[yGroups[j]]
											}
											// return yScale(barheight)
											return yScale(0) ;
									})
									.attr("y", function(d){
										return xScale(d[xVar]);
									})
									.attr("height", xScale.bandwidth())
									.attr("width", function(d) {
										return  yScale(d[yGroups[i]]) ;
									})

									svg.append("text")
									.data(data)
									.style("fill", "#e0ecf4")
									.style("font-size", "1.5rem")
									.style("font-weight", "700")
									.attr("text-anchor", "middle")
									.text(function(d){
										return d[yGroups[i]]+ " %"
									})
									.attr("transform",
										  "translate(" + padding.left + "," + (height/2 - 15) + ")");

									// .attr("x", function (d) { return xScale(d[xVar]); })
									// .attr("y", function (d) {
									// 	let barheight = 0;
									// 	for (let j=i; j>-1; j = j-1) {
									// 		barheight += d[yGroups[j]]
									// 	}
									// 	return yScale(barheight)
									// })
									// .attr("width", xScale.bandwidth())
									// .attr("height", function(d) {
									// 	return height - padding.bottom - yScale(d[yGroups[i]]);
									// })
								// 	.on("mouseover mousemove", function(event, d) {
								//
								// 		d3.select(this)
								// 			.style("opacity", 0.8);
								//
								// 		// console.log(yGroups[i])
								// 		tooltip.select(".part1").html(d.time + "<br>" + yGroups[i] + ":"+ d[yGroups[i]] + "%")
								// 		//
								// 		tooltip
								// 		   .style("visibility", "unset")
								// 		   .style("left", xScale(d[xVar]) + "px")
								// 		   .style("top", height - yScale(d[yGroups[i]]) + "px")
								// }).on("mouseleave", function(d) {
								// 	tooltip
								//    .style("visibility", "hidden")
								//
								//    d3.select(this)
								// 	   .style("opacity", 1.0);
								// })
								}

				  }
				  else{

		let axisBottom = svg.append("g")
							.attr("transform", "translate(0," + (height-padding.bottom) + ")")
							.call(d3.axisBottom(xScale)
							.tickSize(0)
								// .ticks(5)
								// .tickSizeInner(-width)
								// .tickSizeOuter(0)
								// .tickPadding(3)

							);

	// axisBottom.selectAll(".tick text")
	// 	.call(wrapLabel, width/xScale.domain().length - 30)



	// axisBottom.selectAll(".tick text")
	// 	.call(wrapLabel, width/xScale.domain().length - 30)

	svg.append("g")
		.call(d3.axisLeft(yScale)
			// .ticks()
			.tickSizeInner(-width)
			.tickSizeOuter(0)
			.tickPadding(3)

		)
		.call(g => g.select(".domain").remove());

			// add data columns
			for (let i=0; i<yGroups.length; i++) {

					svg.append('g')
						.selectAll("rect")
						.data(data)
						.enter()
					.append("rect")
					.attr("fill", colorScale(yGroups[i]))
					.attr("x", function (d) { return xScale(d[xVar]); })
					.attr("y", function (d) {
						let barheight = 0;
						for (let j=i; j>-1; j = j-1) {
							barheight += d[yGroups[j]]
						}
						return yScale(barheight)
					})
					.attr("width", xScale.bandwidth())
					.attr("height", function(d) {
						return height - padding.bottom - yScale(d[yGroups[i]]);
					})
					.on("mouseover mousemove", function(event, d) {

						d3.select(this)
							.style("opacity", 0.8);

						// console.log(yGroups[i])
						tooltip.select(".part1").html(d.time + "<br>" + yGroups[i] + ":"+ d[yGroups[i]] + "%")
						//
						tooltip
						   .style("visibility", "unset")
						   .style("left", xScale(d[xVar]) + "px")
						   .style("top", height - yScale(d[yGroups[i]]) + "px")
				}).on("mouseleave", function(d) {
	                tooltip
	               .style("visibility", "hidden")

	               d3.select(this)
	                   .style("opacity", 1.0);
	            })


				// stackedColumn.append("text")
				// .text(function(d) {
				// 	// console.log(d[yGroups[i]]);
				// 	// return d[yGroups[i]];
				// 	return "hello";
				// })
				// .attr("fill", "black")
				// .style("text-anchor", "middle")
				// .attr("x", function (d) {
				// 	return (xScale.bandwidth() / 2);
				//
				// })
				// .attr("y", function (d) {
				// 	return yScale(d[yGroups[i]]);
				//
				// })
				// .attr("class", "datalabel2")


					// .on("mousemove", function(d){
					// 	if (window.innerWidth > 600) {
					// 		showTip(d, tooltip, d3.mouse(this))
					// 	}
					// })
					// .on("mouseout", function(d){
					// 	tooltip.style("display", "none")
					// });
			}

			}
// 			const legend = d3.legendColor()
// 			.scale(colorScale)
// 			.labels(function(d,i){
// // 				for (let j=0; j<yGroups.length; j++) {
// // 					console.log(yGroups[j]);
// // 				console.log(d[yGroups[d.i]]);
// // 				console.log(yGroups);
// // // 					for (let j=0; j<d.generatedLabels.length; j++) {
// // 					console.log(data[yGroups[j]])
// //
// // 			}
// 			// console.log(yGroups)
// 			// console.log(d.i)
// 			// console.log(d)
// 			return d.generatedLabels[d.i];
//
//
// 			})
// 			// .labels(function(d,i){
// 			// 	for (let j=0; j<d.generatedLabels.length; j++) {
// 			// 		d.generatedLabels[j] = (parseFloat(d.generatedLabels[j]) + "%")
// 			// 	}
// 			// 	return d.generatedLabels[d.i]
// 			// })
// 			.orient("vertical")
// 			.shapeWidth((width-25)/colorScale.domain().length)
// 			.shapePadding(0)
// 			.labelWrap(250)
// 		const legendContainer = d3.select(el).append("svg")
// 			.attr("width", width-25)
// 			.attr("class","legendContainer")
// 			.attr("height", 100)
// 			.append("g")
// 			.attr("transform", "translate(10,0)")
// 			.call(legend)


// if-else on vertical/horizontal

	} // generateBarChart
</script>

<style>
	.chart :global(g.tick line) {
		stroke: #ccc;
		opacity: 0.5;
	}
	.chart :global(text.datalabel) {
		fill: #000;
		font-family:"akkurat",Arial,sans-serif;
		letter-spacing:-0.05rem;
	}
</style>

<div bind:this={el} class="chart"></div>
