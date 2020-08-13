<script>
	import { onMount } from 'svelte';
	import ColumnChart from './charts/ColumnChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'

	import * as jsondata from '../public/datasets/covidtest.json'

	import { csv } from 'd3-fetch'

	$: coviddata = [];

	csv("../datasets/suffolk.csv").then(function(data,i){
		 coviddata = data;

	});

	let width = Math.min(
		document.getElementById('interactive').getBoundingClientRect().width,
		1000
	);

	// console.log(jsondata.default)
	// console.log(coviddata)

</script>

<style>

</style>

<GraphicTitle
	title={"Today's chart"}
	subhed={"A look at something etc"}
/>
{#if coviddata.length > 0}
	<ColumnChart
		width={width}
		height={width * 0.66}
		data={coviddata.filter(function(d,i){return i > (coviddata.length-36)})}
		xVar={"date"}
		yVar={"newcases"}
	/>
{/if}
<!-- <HoverCard
	data={dataset}
	xVar={"city"}
	yVar={"population"}
/> -->
<GraphicFooter
	source={"The Trust for Public Land"}
	note={"Data includes the top 100 cities by population in the US"}
/>
