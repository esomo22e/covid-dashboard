<script>
import { onMount } from 'svelte';
import { scaleLinear, scaleBand, scaleTime } from 'd3-scale';
import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
import { line } from 'd3-shape';
import { path } from 'd3-path';
import { extent } from 'd3-array';
import { select, selectAll, mouse } from 'd3-selection';
import { timeParse, timeFormat } from 'd3-time-format';
import { legendColor } from 'd3-svg-legend';
import { negativepositive } from '../helpers/colors.js'

let d3 = {
	scaleLinear: scaleLinear,
	scaleBand: scaleBand,
	scaleTime: scaleTime,
	select: select,
	selectAll: selectAll,
	mouse: mouse,
	axisLeft: axisLeft,
	axisRight: axisRight,
	axisBottom: axisBottom,
	axisTop: axisTop,
	line: line,
	extent: extent,
	timeParse: timeParse,
	timeFormat: timeFormat,
	path: path,
	legendColor: legendColor
}

let el;

const padding = { top: 25, right: 0, bottom: 45, left: 30 };

export let data = {data};
export let width = {width};
export let height = {height};
export let xVar = {xVar};



data.forEach(function(d,i){
	d["Week Positive Rate"] = (d["Seven-Day Positive"] / d["Seven-Day Tests"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
})

let lineA = "Week Positive Rate";
let lineB = "Mass. Positive Rate";
let lines = [lineA, lineB];

const parseTime = d3.timeParse("%m/%d/%y");

$: columnAlign = (width / data.length) * 0.5

$: xScale = d3.scaleTime()
	.range([columnAlign, width - padding.left - padding.right - columnAlign]);

$: yScale = d3.scaleLinear()
	.domain([0, 2.5])
	.range([height - padding.bottom, padding.top]);

onMount(generateLineChart);

function generateLineChart() {
	xScale.domain(d3.extent(data, function(d) { return parseTime(d[xVar]); }))

	var tooltip = d3.select(el)
		.append("div")
		.style("opacity", 0)
		.attr("class", "linetooltip")

	var mouseover = function(d) {
		tooltip
			.style("opacity", 1)
	}

	var mousemove = function(d) {
		let mouseaccess = Math.round(xScale.invert(d3.mouse(this)[0])) + (columnAlign*1000000)
		let mousedate = new Date(mouseaccess);
		let findDate = ((mousedate.getMonth()+1) + "/" + (mousedate.getDate()) + "/" + (mousedate.getYear()-100))

		let thisDate = data.filter(function(d) {
			return d["Date"] == findDate
		})

		if (thisDate.length > 0) {
			tooltip
				.html(
					"<div class='tipdate'>" + thisDate[0]["Date"] + "</div>" +
					"<div>Massachusetts 7-Day Moving Average: " + thisDate[0]["Mass. Positive Rate"] + "</div>" +
					"<div>Northeastern 7-Day Moving Average: " + thisDate[0]["Week Positive Rate"] + "</div>"
				)
				.style("left", (d3.mouse(this)[0] + document.getElementById('covid-testing-dashboard').offsetLeft - 100) + "px")
				.style("top", (d3.mouse(this)[1] + document.getElementById('covid-testing-dashboard').offsetTop + 675) + "px")
				.style("opacity", 1)
				.style("display", "block");

			focusA
				.attr("cx", xScale(parseTime(thisDate[0]["Date"])))
				.attr("cy", yScale(parseFloat(thisDate[0][lineA])))
				.attr("opacity", 1);

			focusB
				.attr("cx", xScale(parseTime(thisDate[0]["Date"])))
				.attr("cy", yScale(parseFloat(thisDate[0][lineB])))
				.attr("opacity", 1);
		}

	}

	var mouseleave = function(d) {
		tooltip
			.style("opacity", 0)

		d3.selectAll(".focuscircle")
			.attr("opacity", 0)
	}


	var svg = d3.select(el)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform",
		"translate(" + padding.left + "," + 0 + ")");

	let axisBottomRender = svg.append("g")
		.attr("transform", "translate(0," + (height-padding.bottom) + ")")
		.call(d3.axisBottom(xScale).tickSize(0).tickFormat(d3.timeFormat("%m/%d/%y")));

	axisBottomRender.selectAll("path")
		.attr("stroke", "#ccc")
		.attr("transform", "translate(-" + (columnAlign+4) + ",0) scale(1.1 1)");

	axisBottomRender.selectAll("text")
		.style("text-anchor", "end")
		.attr("transform", ("rotate(-45)"))
		.attr("dx", -2)
		.attr("dy", 6)


	let axisVerticalRender = svg.append("g")
		.call(d3.axisLeft(yScale)
		.ticks(6)
		.tickSize(0)
		.tickFormat(function(d){return d + '%'}));

	axisVerticalRender.selectAll("path")
		.attr("stroke", "#ccc");




	// add data lines
	svg.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "#D41B2C")
	.attr("stroke-width", 3)
	.attr("d", d3.line()
	.x(function(d) { return xScale(parseTime(d[xVar])) })
	.y(function(d) { return yScale(parseFloat(d[lineA]))})
);

var focusA = svg.append("circle")
.attr("class", "focuscircle")
.attr("opacity", 0)
.attr("fill", "#D41B2C")
.attr("r", 5.5)
.attr("cx", 1)
.attr("cy", 1);

svg.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", "#333")
.attr("stroke-width", 3)
.attr("d", d3.line()
.x(function(d) { return xScale(parseTime(d[xVar])) })
.y(function(d) { return yScale(parseFloat(d[lineB]))})
);

var focusB = svg.append("circle")
.attr("class", "focuscircle")
.attr("opacity", 0)
.attr("fill", "#333")
.attr("r", 5.5)
.attr("cx", 1)
.attr("cy", 1);



// svg.append("path")
// 	.datum(data)
// 	.attr("fill", "none")
// 	.attr("stroke", "#d51e2d")
// 	.attr("stroke-width", 1)
// 	.attr("d", d3.line()
// 		.x(function(d) { return xScale(parseTime(d[xVar])) })
// 		.y(function(d) { return yScale(d[lineC])})
// 	)

// svg.append("g")
//   .attr("class", "legendLineOrdinal")
//   .attr("transform", "translate(" + (columnAlign) + "," + 5 + ")");
//
// var legendOrdinal = d3.legendColor()
//   .scale(backcolors)
//   .orient("horizontal")
//   .shape("circle")
//   .shapeRadius(5)
//   .shapePadding(125);
//
// svg.select(".legendLineOrdinal")
//   .call(legendOrdinal)
//   .selectAll('.label')
//   .attr("transform", "translate(10, 4)")
//   .style("text-anchor", "start");

var tooltipgrid = svg.append("rect")
.attr("class","tooltip-grid")
.attr("width", width)
.attr("height", height)
.attr("opacity", 0)
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseleave", mouseleave)



// line labels
// lines.forEach(function(l,i){
// 	let offset;
//
// 	if (
// 		(i < 2) &&
// 		((data[data.length-1][lines[i]] - data[data.length-1][lines[i-1]]) < 15) &&
// 		((data[data.length-1][lines[i]] - data[data.length-1][lines[i-1]]) > 0)
// 		)
// 	{
// 		offset = yScale(data[data.length-1][l]) - 15;
// 	}
// 	else if (
// 		(i < 2) &&
// 		((data[data.length-1][lines[i]] - data[data.length-1][lines[i+1]]) < 15) &&
// 		((data[data.length-1][lines[i]] - data[data.length-1][lines[i+1]]) > 0)
// 		)
// 	{
// 		offset = yScale(data[data.length-1][l]) - 15;
// 	}
// 	else
// 	{
// 		offset = yScale(data[data.length-1][l]);
// 	}
//
// 		// add line label squares
// 	let g = svg.append("g")
// 		.attr("transform", "translate(" + (xScale.range()[1]-2) + ", " + (offset-6) + ")")
//
// 	g.append("rect")
// 		.attr("width",40)
// 		.attr("height",12)
// 		.attr("fill", backcolors[i])
//
// 	g.append("text")
// 		.attr("class","linelabel")
// 		.attr("text-anchor", "start")
// 		.attr("fill", "white")
// 		.attr("x", 0)
// 		.attr("y", 9)
// 		.attr("font-size", "10px")
// 		.attr("font-family", "Flaticon")
// 		.text(generateIcon(data[data.length-1][l], i))
//
// 	g.append("text")
// 		.attr("class","linelabel")
// 		.attr("text-anchor", "end")
// 		.attr("fill", "white")
// 		.attr("x", 38)
// 		.attr("y", 9)
// 		.attr("font-size", "10px")
// 		.html(generateAnno(data[data.length-1][l], i))
// }) // lines ForEach

}
</script>

<style>
.chart :global(){
	display:inline;
}


.chart :global(.legendCells .cell) {
	font-size:0.65rem;
	fill: #777;
	text-transform:uppercase;
}

.chart :global(.linetooltip) {
	display:none;
	position: absolute;
	background-color: white;
	border:2px solid black;
	border-radius:10px;
	padding: 10px;
	width:220px;
	font-size:1rem;
}

.chart :global(.linetooltip div) {
	margin-bottom:0.75rem;
}

.chart :global(.tipdate) {
	font-size:1.2rem;
	font-weight:bold;
	margin:0 auto 0.5rem;
}
</style>


<div bind:this={el} class="chart"></div>
