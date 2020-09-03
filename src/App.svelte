<script>
	import { onMount } from 'svelte';
	import Brief from './charts/Brief.svelte'
	import StackedColumnChart from './charts/StackedColumnChart.svelte'
	import DonutChart from './charts/DonutChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
   import SvelteTable from "svelte-table"
	import { csv, json } from 'd3-fetch'
	import { groups } from 'd3-array'
	import { colors, positivegroups } from './helpers/colors.js'

	const todaysDate = new Date();
	// const dateCode = "" + (todaysDate.getMonth()+1) + todaysDate.getDate() + todaysDate.getHours()
	const dateCode = todaysDate.getTime()

	const url = 'https://spreadsheets.google.com/feeds/cells/1C8PDCqHB9DbUYbvrEMN2ZKyeDGAMAxdcNkmO2QSZJsE/1/public/full?alt=json&date=' + dateCode

  //Check if the test brief should show (if the id exists)
	let fullDash = true;
	if (document.getElementById('covid-test-brief')) {
		fullDash = false;
	}

	$: coviddata = [];





	// const doc = new GoogleSpreadsheet('1C8PDCqHB9DbUYbvrEMN2ZKyeDGAMAxdcNkmO2QSZJsE');
	// doc.useServiceAccountAuth('credentials.json');



	// csv("datasets/testingdata.csv").then(function(data,i){
	// csv("//news.northeastern.edu/interactive/2020/08/covid-testing-dashboard/datasets/testingdata.csv").then(function(data,i){
	// 	data.forEach(function(d,i){
	// 		Object.keys(d).forEach(function(j) {
	// 			if ((j == "Date") || (j == "Mass. Positive Rate")) {
	// 				d[j] = d[j]
	// 			} else {
	// 				d[j] = parseFloat(d[j])
	// 			}
	//
	// 		})
	// 	});
	//
	// 	coviddata = data;
	//
	// });

	const headings = ["Date", "Tests Completed", "Positive Tests", "Negative Tests", "Students Positive",	"FacStaff Positive",	"Contracted Positive", "Mass. Positive Rate", "Seven-Day Tests", "Seven-Day Positive", "Seven-Day Negative", "Total Tests", "Total Positive", "Total Negative", "Total Students Positive",	"Total FacStaff Positive",	"Total Contracted Positive"]

	json(url).then(function(data,i){
		let rowcount = ((data.feed.entry.length / headings.length)-1)
		let loadeddata = []

		for (let r=0; r < rowcount; r++) {
			loadeddata[r] = {}
		}

		data.feed.entry.filter(d => (d.gs$cell.row !== "1")).forEach(function(d,i){
			let colno = parseFloat([d.gs$cell.col])-1

			if ((colno === 0) || (colno === 7)) {
				loadeddata[parseFloat([d.gs$cell.row])-2][headings[colno]] = d.gs$cell.inputValue
			} else {
				loadeddata[parseFloat([d.gs$cell.row])-2][headings[colno]] = parseFloat(d.gs$cell.numericValue)
			}
		})



		coviddata = loadeddata;
	})





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
			 ((parseFloat(v["Mass. Positive Rate"])*10)/1000).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1})
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
	  margin-bottom:15px;
	}

	@media screen and (max-width:600px) {
		#dashboard-grid {
			grid-template-columns: 1fr;
		 	  grid-template-rows: 1fr;
		 	  gap: 40px 60px;
			grid-template-areas: "dash-brief" "dash-bars" "dash-donut" "dash-table";
		}

		.dash-table {
			overflow:scroll;
		}
	}

	.dash-brief { grid-area: dash-brief; }

	.dash-bars { grid-area: dash-bars; }

	.dash-donut { grid-area: dash-donut; }

	.dash-table { grid-area: dash-table; }

	.dashboard-grid-item {
	}

	.update-line {
		font-size:0.85rem;
		color: #555;
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
			 <p class="update-line"><i>Updated daily with the latest available numbers. Data includes students, faculty, staff, and contract employees.</i></p>
		</div>
		{#if fullDash }
		<div class="dashboard-grid-item dash-bars" id="column-chart-container">
			<GraphicTitle
				title={"Test Results by Date"}
			/>
			<StackedColumnChart
				width={width2}
				height={width2 * 0.8}
				data={coviddata}
				xVar={"Date"}
				yVar={"Tests Completed"}
				yGroups={["Negative Tests", "Positive Tests"]}
				colorscheme={colors}
			/>
			<StackedColumnChart
				width={width2}
				height={width2 * 0.45}
				data={coviddata}
				xVar={"Date"}
				yVar={"Positive Tests"}
				yGroups={["Students Positive", "FacStaff Positive", "Contracted Positive"]}
				colorscheme={positivegroups}
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
		{/if}
	</div>
{/if}
	{#if fullDash }
<GraphicFooter
	source={"Northeastern Life Sciences Testing Center and the Broad Institute"}
	note={""}
/>
{/if}
