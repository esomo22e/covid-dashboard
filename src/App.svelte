<script>
	import { onMount } from 'svelte';
	import StackedColumnChart from './charts/StackedColumnChart.svelte'
	import DonutChart from './charts/DonutChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
   import SvelteTable from "svelte-table"


	import { csv } from 'd3-fetch'

	$: coviddata = [];

	csv("../datasets/samples0819.csv").then(function(data,i){
		 coviddata = data;

	});

	let width = document.getElementById('interactive').getBoundingClientRect().width;
	let width1 = width;
	let width2 = width;

	const columns = [
	  {
	    key: "Date",
	    title: "Date",
	    value: v => v["Date"],
	    sortable: false,
	    headerClass: "text-left"
	  },
	  {
	    key: "Samples Taken",
	    title: "Samples Taken",
	    value: v => v["Samples Taken"],
	    sortable: false,
	    headerClass: "text-left"
	  },
	  {
	    key: "Tests Completed",
	    title: "Tests Completed",
	    value: v => v["Tests Completed"],
	    sortable: false,
	    headerClass: "text-left"
	  },
	  {
	    key: "Tests in Progress",
	    title: "Tests in Progress",
	    value: v => v["Tests in Progress"],
	    sortable: false,
	    headerClass: "text-left"
	  },
	  {
	    key: "Positive Tests",
	    title: "Positive Tests",
	    value: v => v["Positive Tests"],
	    sortable: false,
	    headerClass: "text-left"
	  },
	  {
	    key: "Positive Rate",
	    title: "Positive Rate",
	    value: v => (
			 (v["Positive Tests"] / v["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
		 ),
	    sortable: false,
	    headerClass: "text-left"
	  }
  ]

	// console.log(jsondata.default)
	// console.log(coviddata)

</script>

<style>
	#dashboard-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr 1fr;
	  grid-template-rows: 1fr 1fr;
	  gap: 20px 20px;
	  grid-template-areas: "dash-bars dash-bars dash-donut ." "dash-table dash-table dash-table ." ". . . .";
	}

	.dash-bars { grid-area: dash-bars; }

	.dash-donut { grid-area: dash-donut; }

	.dash-table { grid-area: dash-table; }

	.dashboard-grid-item {
		background-color: papayawhip;
	}

</style>


<!-- {#if coviddata.length > 0}
	<ColumnChart
		width={width}
		height={width * 0.66}
		data={coviddata.filter(function(d,i){return i > (coviddata.length-36)})}
		xVar={"date"}
		yVar={"newcases"}
	/>
{/if} -->
{#if coviddata.length > 0}
	<div id="dashboard-grid">
		<div class="dashboard-grid-item dash-bars" id="column-chart-container">
			<GraphicTitle
				title={"Samples by Date"}
			/>
			<StackedColumnChart
				width={(width * 0.66) - 20}
				height={width * 0.66 * 0.66}
				data={coviddata}
				xVar={"Date"}
				yVar={"Samples Taken"}
				yA={"Tests Completed"}
				yB={"Tests in Progress"}
			/>
		</div>
		<div class="dashboard-grid-item dash-donut">
			<GraphicTitle
				title={"Current Positive Rate"}
			/>
			<DonutChart
				width={width * 0.33}
				height={width * 0.33}
				data={coviddata}
				xVar={"Date"}
				yVar={"Samples Taken"}
				yA={"Tests Completed"}
				yB={"Tests in Progress"}
			/>
		</div>
		<div class="dashboard-grid-item dash-table">
			<SvelteTable
			   columns={columns}
			   rows={coviddata}
			   sortOrder={1}
			   clickCol={(event,row,key) => console.log(event,row,key)}
			   sortBy={"Date"}
			   classNameCell={"infocell"}
			>
			</SvelteTable>
		</div>
	</div>
{/if}
<GraphicFooter
	source={"Northeastern University"}
	note={""}
/>
