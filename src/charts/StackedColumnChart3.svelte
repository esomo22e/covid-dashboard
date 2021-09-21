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
	export let yGroups_fac = {yGroups_fac};
	export let yGroups_con = {yGroups_con};
	export let colorsteps = yGroups.length;
	export let len = data.length;
	export let yDomain = ([0, 100])
	export let colorscheme = vibrant;
	export let orientation = "horizontal";

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

	// $: colorScale_fac = d3.scaleOrdinal()
	// .domain(yGroups_fac)
	// .range(colorscheme)
	//
	// $: colorScale_con = d3.scaleOrdinal()
	// .domain(yGroups_con)
	// .range(colorscheme)
		// .domain(data.map(function(o) { return o[xVar]; }))
		// .range(colorscheme);

	onMount(generateStackedColumn);

	function generateStackedColumn() {

		// var donutcaption = d3.select(el)
	   	// .append("div")
		// .attr("class")
	   	// .style("text-align", "center")
	   	// .style("margin", "0 auto 2rem")

		// donutcaption.append("div")
		// 	.style("font-size", "1rem")
		// 	.style("line-height", "1.25rem")
		// 	.text("7-day average of positive test results at Northeastern: ")

		// var donutcaption = d3.select(el)
		// 	.append("div")
		// 	.style("text-align", "center")
		// 	.style("margin", "0 auto 0rem")

		// donutcaption.append("div")
		// 	.style("font-size", "1rem")
		// 	.style("line-height", "1.25rem")
		// 	.text("7-day average of positive test results at Northeastern: ")
		//



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


			.attr("height", 580)
			.append("g")
			.attr("transform",
				  "translate(" + 20+ "," + padding.top + ")");


				  // donutcaption.append("div")
		  			// .style("font-size", "1.5rem")
		  			// // .style("color", "#D41B2C")
		  			// .style("font-weight", "700")
		  			// .style("margin-bottom", "0rem")
		  			// .text("Student Vaccination Rate")
		  			// .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

				  // add data columns
			  	for (let i=0; i<yGroups.length; i++) {




					svg.append('g')
   		  		  .selectAll("rect")
   		  		  .data(data)
   		  		  .enter()
   		  	  .append("rect")
			  .attr("class", "rect_1")
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
			  			return xScale(d[xVar]) + 30;
			  		})
			  		.attr("height", xScale.bandwidth())
			  		.attr("width", function(d) {
			  			// console.log(d[yGroups[i]])
			  			return  yScale(d[yGroups[i]]) ;


					})

					svg.append("text")
			  		.data(data)
			  		.style("fill", "#e0ecf4")
			  		.style("font-size", "1.5rem")
			  		.style("font-weight", "700")
			  		.attr("text-anchor", "middle")
			  		.text(function(d){
			  			// console.log(d)
			  			return d[yGroups[i]]+ " %"
			  		})
			  		.attr("transform",
			  			  "translate(" + padding.left + "," + (height/2 + 15) + ")");


						  svg.append("text")
	  			  		.data(data)
	  			  		.style("fill", "#333")
	  			  		.style("font-size", "1.5rem")
	  			  		.style("font-weight", "700")
	  			  		.attr("text-anchor", "middle")
	  			  		.text(function(d){
	  			  			// console.log(d)
	  			  			return "Student Vaccination Rate"
	  			  		})
	  			  		.attr("transform",
	  			  			  "translate(" + (padding.left+70) + "," + (height/2 -40) + ")");

			  	}



					for (let i=0; i<yGroups_fac.length; i++) {
						svg.append('g')
					  .selectAll("rect")
					  .data(data)
					  .enter()
				  .append("rect")
				  .attr("class", "rect_2")
						.attr("fill", colorScale(yGroups_fac[i]))
						.attr("x", function(d){
								let barheight = 0;
								for (let j=i; j>-1; j = j-1) {
									barheight += d[yGroups_fac[j]]
								}
								// return yScale(barheight)
								return yScale(0) ;
						})
						.attr("y", function(d){
							return xScale(d[xVar]) + 150;
						})
						.attr("height", xScale.bandwidth())
						.attr("width", function(d) {
							// console.log(d[yGroups[i]])
							return  yScale(d[yGroups_fac[i]]) ;
						})


						// svg.append("text")
				  		// .data(data)
				  		// .style("fill", "#e0ecf4")
				  		// .style("font-size", "1.5rem")
				  		// .style("font-weight", "700")
				  		// .attr("text-anchor", "middle")
				  		// .text(function(d){
				  		// 	// console.log(d)
				  		// 	return d[yGroups_fac[i]]+ " %"
				  		// })
				  		// .attr("transform",
				  		// 	  "translate(" + padding.left + "," + (height/2 +115) + ")");


						svg.append("text")
  					  		.data(data)
  					  		.style("fill", "#e0ecf4")
  					  		.style("font-size", "1.5rem")
  					  		.style("font-weight", "700")
  					  		.attr("text-anchor", "middle")
  					  		.text(function(d){
  					  			// console.log(d)
  					  			return d[yGroups_fac[i]]+ " %"
  					  		})
  					  		.attr("transform",
  					  			  "translate(" + padding.left + "," + (height/2 +135) + ")");


								  svg.append("text")
		 					   .data(data)
		 					   .style("fill", "#333")
		 					   .style("font-size", "1.5rem")
		 					   .style("font-weight", "700")
		 					   .attr("text-anchor", "middle")
		 					   .text(function(d){
		 						   // console.log(d)
		 						   return "Faculty Vaccination Rate"
		 					   })
		 					   .attr("transform",
		 							 "translate(" + (padding.left+70) + "," + (height/2 +85) + ")");

					}


					for (let i=0; i<yGroups_con.length; i++) {

					svg.append('g')
				  .selectAll("rect")
				  .data(data)
				  .enter()
			  .append("rect")
			  .attr("class", "rect_2")
					.attr("fill", colorScale(yGroups_con[i]))
					.attr("x", function(d){
							let barheight = 0;
							for (let j=i; j>-1; j = j-1) {
								barheight += d[yGroups_con[j]]
							}
							// return yScale(barheight)
							return yScale(0) ;
					})
					.attr("y", function(d){
						return xScale(d[xVar]) + 270;
					})
					.attr("height", xScale.bandwidth())
					.attr("width", function(d) {
						// console.log(d[yGroups[i]])
						return  yScale(d[yGroups_con[i]]) ;
					})

					svg.append("text")
						.data(data)
						.style("fill", "#e0ecf4")
						.style("font-size", "1.5rem")
						.style("font-weight", "700")
						.attr("text-anchor", "middle")
						.text(function(d){
							// console.log(d)
							return d[yGroups_con[i]]+ " %"
						})
						.attr("transform",
							  "translate(" + padding.left + "," + (height/2 +255) + ")");


							  svg.append("text")
						   .data(data)
						   .style("fill", "#333")
						   .style("font-size", "1.5rem")
						   .style("font-weight", "700")
						   .attr("text-anchor", "middle")
						   .text(function(d){
							   // console.log(d)
							   return "Contract Vaccination Rate"
						   })
						   .attr("transform",
								 "translate(" + (padding.left+70) + "," + (height/2 +205) + ")");

				}

				  // if (orientation !== "vertical") {
				  //
				  //
					// 			// svg.append("div")
					// 			// 	.style("font-size", "1.5rem")
					// 			// 	.style("color", "#6e016b")
					// 			// 	.style("font-weight", "700")
					// 			// 	.style("margin-bottom", "0rem")
					// 			// 	.text("Students")
				  //
				  //
				  //
					// 			// add data columns
					// 			for (let i=0; i<yGroups.length; i++) {
				  //
				  //
					// 				console.log(i)
				  //
					// 			 	svg.append('g')
					// 					.selectAll("rect")
					// 					.data(data)
					// 					.enter()
					// 				.append("rect")
					// 				.attr("fill", colorScale(yGroups[i]))
					// 				.attr("x", function(d){
					// 						let barheight = 0;
					// 						for (let j=i; j>-1; j = j-1) {
					// 							barheight += d[yGroups[j]]
					// 						}
					// 						// return yScale(barheight)
					// 						return yScale(0) ;
					// 				})
					// 				.attr("y", function(d){
					// 					return xScale(d[xVar]);
					// 				})
					// 				.attr("height", xScale.bandwidth())
					// 				.attr("width", function(d) {
					// 					// console.log(d[yGroups[i]])
					// 					return  yScale(d[yGroups[i]]) ;
					// 				})
				  //
					// 				svg.append("text")
					// 				.data(data)
					// 				.style("fill", "#e0ecf4")
					// 				.style("font-size", "1.5rem")
					// 				.style("font-weight", "700")
					// 				.attr("text-anchor", "middle")
					// 				.text(function(d){
					// 					// console.log(d)
					// 					return d[yGroups[i]]+ " %"
					// 				})
					// 				.attr("transform",
					// 					  "translate(" + padding.left + "," + (height/2 - 15) + ")");
				  //
					// 				// .attr("x", function (d) { return xScale(d[xVar]); })
					// 				// .attr("y", function (d) {
					// 				// 	let barheight = 0;
					// 				// 	for (let j=i; j>-1; j = j-1) {
					// 				// 		barheight += d[yGroups[j]]
					// 				// 	}
					// 				// 	return yScale(barheight)
					// 				// })
					// 				// .attr("width", xScale.bandwidth())
					// 				// .attr("height", function(d) {
					// 				// 	return height - padding.bottom - yScale(d[yGroups[i]]);
					// 				// })
					// 			// 	.on("mouseover mousemove", function(event, d) {
					// 			//
					// 			// 		d3.select(this)
					// 			// 			.style("opacity", 0.8);
					// 			//
					// 			// 		// console.log(yGroups[i])
					// 			// 		tooltip.select(".part1").html(d.time + "<br>" + yGroups[i] + ":"+ d[yGroups[i]] + "%")
					// 			// 		//
					// 			// 		tooltip
					// 			// 		   .style("visibility", "unset")
					// 			// 		   .style("left", xScale(d[xVar]) + "px")
					// 			// 		   .style("top", height - yScale(d[yGroups[i]]) + "px")
					// 			// }).on("mouseleave", function(d) {
					// 			// 	tooltip
					// 			//    .style("visibility", "hidden")
					// 			//
					// 			//    d3.select(this)
					// 			// 	   .style("opacity", 1.0);
					// 			// })
					// 			}
				  //
				  // }
	// 			  else{
	//
	// 	// let axisBottom = svg.append("g")
	// 	// 					.attr("transform", "translate(0," + (height-padding.bottom) + ")")
	// 	// 					.call(d3.axisBottom(xScale)
	// 	// 					.tickSize(0)
	// 	// 						// .ticks(5)
	// 	// 						// .tickSizeInner(-width)
	// 	// 						// .tickSizeOuter(0)
	// 	// 						// .tickPadding(3)
	// 	//
	// 	// 					);
	//
	// // axisBottom.selectAll(".tick text")
	// // 	.call(wrapLabel, width/xScale.domain().length - 30)
	//
	//
	//
	// // axisBottom.selectAll(".tick text")
	// // 	.call(wrapLabel, width/xScale.domain().length - 30)
	//
	// svg.append("g")
	// 	.call(d3.axisLeft(yScale)
	// 		// .ticks()
	// 		.tickSizeInner(-width)
	// 		.tickSizeOuter(0)
	// 		.tickPadding(3)
	//
	// 	)
	// 	.call(g => g.select(".domain").remove());
	//
	// 		// add data columns
	// 		for (let i=0; i<yGroups.length; i++) {
	//
	// 				svg.append('g')
	// 					.selectAll("rect")
	// 					.data(data)
	// 					.enter()
	// 				.append("rect")
	// 				.attr("fill", colorScale(yGroups[i]))
	// 				.attr("x", function (d) { return xScale(d[xVar]); })
	// 				.attr("y", function (d) {
	// 					let barheight = 0;
	// 					for (let j=i; j>-1; j = j-1) {
	// 						barheight += d[yGroups[j]]
	// 					}
	// 					return yScale(barheight)
	// 				})
	// 				.attr("width", xScale.bandwidth())
	// 				.attr("height", function(d) {
	// 					return height - padding.bottom - yScale(d[yGroups[i]]);
	// 				})
	// 				.on("mouseover mousemove", function(event, d) {
	//
	// 					d3.select(this)
	// 						.style("opacity", 0.8);
	//
	// 					// console.log(yGroups[i])
	// 					tooltip.select(".part1").html(d.time + "<br>" + yGroups[i] + ":"+ d[yGroups[i]] + "%")
	// 					//
	// 					tooltip
	// 					   .style("visibility", "unset")
	// 					   .style("left", xScale(d[xVar]) + "px")
	// 					   .style("top", height - yScale(d[yGroups[i]]) + "px")
	// 			}).on("mouseleave", function(d) {
	//                 tooltip
	//                .style("visibility", "hidden")
	//
	//                d3.select(this)
	//                    .style("opacity", 1.0);
	//             })
	//
	//
	//
	// 		}
	//
	// 		}


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
