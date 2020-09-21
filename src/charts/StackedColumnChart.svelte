<script>
import { onMount } from 'svelte';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
import { select, mouse } from 'd3-selection';
import { line, curveMonotoneX, curveNatural } from 'd3-shape';
import { path } from 'd3-path';
import { interpolateRound } from 'd3-interpolate';
import 'd3-transition'
import { legendColor } from 'd3-svg-legend';

let d3 = {
	scaleLinear: scaleLinear,
	scaleBand: scaleBand,
	scaleOrdinal: scaleOrdinal,
	select: select,
	mouse: mouse,
	axisLeft: axisLeft,
	axisRight: axisRight,
	axisBottom: axisBottom,
	axisTop: axisTop,
	line: line,
	path: path,
	curveMonotoneX: curveMonotoneX,
	curveNatural: curveNatural,
	interpolateRound: interpolateRound,
	legendColor: legendColor
}

let el;

const padding = { top: 50, right: 0, bottom: 40, left: 40 };



export let data = {data};
export let width = {width};
export let height = {height};
export let xVar = {xVar};
export let yVar = {yVar};
export let yGroups = {yGroups};
export let colorscheme = {colorscheme};
export let colorsteps = yGroups.length;

export let avgdaycount = 7;

// let len = data.length;
//
// for (let k=0; k < (len-31); k++) {
// 	data.shift()
// }


// data.forEach(function(d,i){
// 	if (i > (avgdaycount-2)) {
// 		let array = [];
// 		for (let j=0;  j<avgdaycount; j++) {
// 			array.push( +data[i-j][yVar] )
// 		}
// 		let avg = array.reduce((a, b) => a + b, 0) / avgdaycount;
// 		data[i]["rollingavg"] = Math.round(avg);
// 	}
// })

$: xScale = d3.scaleBand()
	.domain(data.map(function(o) { return o[xVar]; }))
	.rangeRound([0, width - padding.left - padding.right])
	.padding(0.1);

$: yScale = d3.scaleLinear()
	.domain([0, Math.max.apply(Math, data.map(function(o) { return o[yVar]; }))])
	.range([height - padding.bottom, padding.top])
	.nice();

$: colors = d3.scaleOrdinal()
	.domain(yGroups)
	.range(colorscheme)

function showTip(d, target, mouse) {
	target
		.style("position", "absolute")
		.style("left", (mouse[0] + document.getElementById('covid-testing-dashboard').offsetLeft - 100) + "px")
		.style("top", (mouse[1] + document.getElementById('covid-testing-dashboard').offsetTop + 370) + "px")
		.style("display", "inline-block")
		.html(
			function(g) {
				let arr = [];
				for (g=0; g<yGroups.length; g++) {
					arr.push("<br/>" + yGroups[g] + ": " + d[yGroups[g]])
				}
				return "<div class='tipdate'>" + d[xVar] + "</div>" + arr.join(' ')
			}

		);
}

onMount(generateColumnChart);

function generateColumnChart() {

	var tooltip = d3.select(el).append("div").attr("class", "tooltip");

	var svg = d3.select(el)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform",
		"translate(" + padding.left + "," + 0 + ")");

	let axisBottomRender = svg.append("g")
		.attr("transform", "translate(0," + (height-padding.bottom) + ")")
		.attr("class","horizontalAxis")
		.call(d3.axisBottom(xScale).tickSize(0));

	axisBottomRender.selectAll("path")
		.attr("stroke", "#ccc");

	axisBottomRender.selectAll("text")
		.style("text-anchor", "end")
		.attr("transform", ("rotate(-45)"))
		.attr("dx", -3)
		.attr("dy", 3.5)


	let axisVerticalRender = svg.append("g")
		.attr("class","verticalAxis")
		.call(
			d3.axisLeft(yScale)
				.ticks(Math.min(6, yScale.domain()[1]))
				.tickSize(0)
		);

	axisVerticalRender.selectAll("path")
		.attr("stroke", "#ccc");

	// add data columns
	for (let i=0; i<yGroups.length; i++) {
		svg.append('g')
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("fill", colors(yGroups[i]))
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
			.on("mousemove", function(d){
				if (window.innerWidth > 600) {
					showTip(d, tooltip, d3.mouse(this))
				}
			})
			.on("mouseout", function(d){
				tooltip.style("display", "none")
			});
	}


	svg.append("g")
		.attr("class", "legendOrdinal")
		.attr("transform", "translate(" + 0 + "," + 0 + ")");

	var legendOrdinal = d3.legendColor()
		.scale(colors)
		.orient("horizontal")
		.shape("rect")
		.shapeWidth((width-125) / colorsteps)
		.shapePadding(120 / colorsteps)
		.shapeHeight(10);

	svg.select(".legendOrdinal")
		.call(legendOrdinal);

	// svg.append("path")
	//  .datum(data.filter(function(d,i){
	//   return i > (avgdaycount-2)
	//  }))
	//  .attr("fill", "none")
	//  .attr("stroke", "#d51e2d")
	//  .attr("stroke-width", 5)
	//  .attr("d", d3.line()
	//  	 .curve(d3.curveNatural)
	//    .x(function(d) { return xScale(d[xVar]) + (xScale.bandwidth()/2); })
	//    .y(function(d) { return yScale(d["rollingavg"]); })
	// )
}
</script>

<style>
.chart :global(rect) {
	/* fill: #cfbabc; */
}

.chart :global(.tooltip) {
	display:none;
	position: absolute;
	background-color: white;
	border:2px solid black;
	border-radius:10px;
	padding: 10px;
	width:300px;
}

.chart :global(.legendCells .cell) {
	font-size:0.65rem;
	fill: #777;
	text-transform:uppercase;
}

.chart :global(.tipdate) {
	font-size:1.2rem;
	font-weight:bold;
	margin:0 auto;
}


.chart :global(.horizontalAxis .tick:nth-last-child(2n) text) {
	 visibility: hidden;
}

</style>

<div bind:this={el} class="chart"></div>
