<script>
	import { onMount } from 'svelte';
	import ColumnChart from './charts/ColumnChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'

	import * as jsondata from '../public/datasets/covidtest.json'

	let width = Math.min(
		document.getElementById('interactive').getBoundingClientRect().width,
		1000
	);
</script>

<style>

</style>

<GraphicTitle
	title={"Today's chart"}
	subhed={"A look at something etc"}
/>
<ColumnChart
	width={width}
	height={width * 0.66}
	data={jsondata}
	xVar={"date"}
	yVar={"newcases"}
/>
<!-- <HoverCard
	data={dataset}
	xVar={"city"}
	yVar={"population"}
/> -->
<GraphicFooter
	source={"The Trust for Public Land"}
	note={"Data includes the top 100 cities by population in the US"}
/>
