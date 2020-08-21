<script>
	import { onMount } from 'svelte';
	import Brief from './charts/Brief.svelte'
	import StackedColumnChart from './charts/StackedColumnChart.svelte'
	import DonutChart from './charts/DonutChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
   import SvelteTable from "svelte-table"


	import { csv } from 'd3-fetch'

	$: coviddata = [];

	// csv("//news.northeastern.edu/interactive/2020/08/covid-testing-dashboard/datasets/testingdata.csv").then(function(data,i){
	csv("datasets/testingdata.csv").then(function(data,i){
		data.forEach(function(d,i){
			Object.keys(d).forEach(function(j) {
				if ((j == "Date") || (j == "Mass. Positive Rate")) {
					d[j] = d[j]
				} else {
					d[j] = parseFloat(d[j])
				}

			})
		});

		coviddata = data;

	});

	let width = document.getElementById('covid-testing-dashboard').getBoundingClientRect().width;
	let width1 = Math.min(width, 350);
	let width2 = width;

	if (window.innerWidth > 600) {
		width1 = width * 0.33;
		width2 = (width * 0.66) - 60
	}

	const columns = [
	  {
	    key: "Date",
	    title: "Date",
	    value: v => v["Date"],
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Tests Completed",
	    title: "Tests Completed",
	    value: v => v["Tests Completed"],
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Negative Tests",
	    title: "Negative Tests",
	    value: v => v["Negative Tests"],
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Negative Rate",
	    title: "Negative Rate",
	    value: v => (
			 (v["Negative Tests"] / v["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
		 ),
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Inconclusive Tests",
	    title: "Inconclusive Tests",
	    value: v => v["Inconclusive Tests"],
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Inconclusive Rate",
	    title: "Inconclusive Rate",
	    value: v => (
			 (v["Inconclusive Tests"] / v["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
		 ),
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Positive Tests",
	    title: "Positive Tests",
	    value: v => v["Positive Tests"],
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Positive Rate",
	    title: "Positive Rate",
	    value: v => (
			 (v["Positive Tests"] / v["Tests Completed"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
		 ),
	    sortable: true,
	    headerClass: "text-left"
	  },
	  {
	    key: "Mass. Positive Rate",
	    title: "MA Positive Rate",
	    value: v => (
			 (v["Mass. Positive Rate"]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
		 ),
	    sortable: true,
	    headerClass: "text-left"
	  }
  ]


</script>

<style>
	#dashboard-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr 1fr;
	  grid-template-rows: 1fr auto;
	  gap: 20px 60px;
	  grid-template-areas: "dash-brief dash-brief dash-brief" "dash-bars dash-bars dash-donut" "dash-table dash-table dash-table";
	  margin-bottom:40px;
	}

	@media screen and (max-width:600px) {
		#dashboard-grid {
			grid-template-columns: 1fr;
		 	  grid-template-rows: 1fr;
		 	  gap: 40px 60px;
			grid-template-areas: "dash-brief" "dash-bars" "dash-donut";
		}

		.dash-table {
			display:none;
		}
	}

	.dash-brief { grid-area: dash-brief; }

	.dash-bars { grid-area: dash-bars; }

	.dash-donut { grid-area: dash-donut; }

	.dash-table { grid-area: dash-table; }

	.dashboard-grid-item {
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
		<div class="dashboard-grid-item dash-brief">
			<Brief
				data={coviddata}
			/>
			 <p><i>Updated daily with the latest available numbers.</i></p>
		</div>
		<div class="dashboard-grid-item dash-bars" id="column-chart-container">
			<GraphicTitle
				title={"Test Results by Date"}
			/>
			<StackedColumnChart
				width={width2}
				height={width2 * 0.75}
				data={coviddata}
				xVar={"Date"}
				yVar={"Tests Completed"}
				yA={"Positive Tests"}
				yB={"Negative Tests"}
				yC={"Inconclusive Tests"}
			/>
		</div>
		<div class="dashboard-grid-item dash-donut">
			<GraphicTitle
				title={"Current Positive Rate"}
			/>
			<DonutChart
				width={width1}
				height={width1}
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
				sortBy={"Date"}
			   sortOrder={-1}
			   classNameCell={"infocell"}
			>
			</SvelteTable>
		</div>
	</div>
{/if}
<GraphicFooter
	source={"Northeastern Life Sciences Testing Center"}
	note={""}
/>
