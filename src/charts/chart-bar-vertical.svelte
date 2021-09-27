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
export let category = {category};
export let value = {value};
export let groups = {groups};

export let colorscheme = {colorscheme};
export let colorsteps = groups.length;
export let hasAccent = false;
let len = data.length;

let classNames = [
    "graph",
    "bar-graph"
];

if (hasAccent) {
    classNames.push("has-accent");
}

const getClassNames = () => {
    return classNames.join(" ");
}

$: xScale = d3.scaleBand()
	.domain(data.map(function(o) { return o[category]; }))
	.range([1, width - padding.left - padding.right])
	.padding(0.1);

$: yScale = d3.scaleLinear()
	.domain([0, Math.max.apply(Math, data.map(function(o) { return o[value]; }))])
	.range([height - padding.bottom, padding.top])
	.nice();

$: colors = d3.scaleOrdinal()
	.domain(groups)
	.range(colorscheme)

function showTip(d, target, mouse) {
	target
		.style("position", "absolute")
		.style("left", (mouse[0] - 100) + "px")
		.style("top", (mouse[1] - 150) + "px")
		.style("display", "inline-block")
		.html(
			function(g) {
				let arr = [];
				for (g=0; g<groups.length; g++) {
					arr.push("<br/>" + groups[g] + ": " + d[groups[g]])
				}
				return "<div class='tipdate'>" + d[category] + "</div>" + arr.join(' ')
			}

		);
}

onMount(generateColumnChart);

function generateColumnChart() {

	let tooltip = d3.select(el).append("div").attr("class", "tooltip");

	let graph = d3.select(el)
		.append("svg")
        .attr("class", "graph-visual")
		.attr("width", width)
		.attr("height", height);

    let plotWrapper = graph.append("g")
		.attr("transform",
		"translate(" + padding.left + "," + 0 + ")");

	let xAxis = plotWrapper.append("g")
        .attr("class", "graph-plot")
		.attr("transform", "translate(0," + (height-padding.bottom) + ")")
		.attr("class","axis axis--x")
		.call(
			d3.axisBottom(xScale)
				.tickValues(xScale.domain().filter(function(d,i){
					let tickCount = Math.round(xScale.domain().length/10);
					let lastTick = xScale.domain().length-1;
					return ((i % tickCount) === (lastTick % tickCount))
				}))
				.tickSize(0)
		);

	let xAxisLine = xAxis.selectAll("path")
		.attr("class", "axis-line axis-line--x");

    let xAxisLabel = xAxis.selectAll("text")
        .attr("class", "axis-label  axis-label--x")
		.attr("dx", -3)
		.attr("dy", 3.5)


	let yAxis = plotWrapper.append("g")
		.attr("class","axis axis--y")
		.call(
			d3.axisLeft(yScale)
				.ticks(
				    Math.min(6, yScale.domain()[1])
                )
				.tickSize(0)
		);

	let yAxisLine = yAxis.selectAll("path")
		.attr("class", "axis-line axis-line--y");

	let yAxisLabel = yAxis.selectAll("text")
    .attr("class", "axis-label axis-label--y")

	// add data columns
	for (let i=0; i<groups.length; i++) {

        plotWrapper.append('g')
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("fill", colors(groups[i]))
			.attr("x", function (d) {
                return xScale(d[category]); })
			.attr("y", function (d) {
				let barheight = 0;
				for (let j=i; j>-1; j = j-1) {
					barheight += d[groups[j]]
				}
				return yScale(barheight)
			})
			.attr("width", xScale.bandwidth())
			.attr("height", function(d) {
				return height - padding.bottom - yScale(d[groups[i]]);
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


}
</script>

<style>
.chart :global() {
	position:relative;
}
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

/* .chart :global(.horizontalAxis .tick text) {
	 visibility: hidden;
}


.chart :global(.horizontalAxis .tick:nth-last-child(7n+1) text) {
	 visibility: visible;
}

@media screen and (max-width:600px) {
	.chart :global(.horizontalAxis .tick:nth-last-child(7n+1) text) {
		 visibility: hidden;
	}

	.chart :global(.horizontalAxis .tick:nth-last-child(14n+1) text) {
		 visibility: visible;
	}
} */

</style>

<figure bind:this={el} class="{getClassNames()}"></figure>
