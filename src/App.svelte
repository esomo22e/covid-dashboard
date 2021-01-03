<script>
	import { onMount } from 'svelte';
	import Brief from './charts/Brief.svelte'
	import WellnessSummary from './charts/WellnessSummary.svelte'
	import StackedColumnChart from './charts/StackedColumnChart.svelte'
	import DonutChart from './charts/DonutChart.svelte'
		import LineChart from './charts/MultiLineChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
   import SvelteTable from "svelte-table"
	import { csv, json } from 'd3-fetch'
	import { groups } from 'd3-array'
	import { timeParse, timeFormat } from 'd3-time-format';
	import { negativepositive, groupbylevel } from './helpers/colors.js'

	const todaysDate = new Date();
	const dateCode = todaysDate.getTime()

	const url = 'https://spreadsheets.google.com/feeds/cells/1C8PDCqHB9DbUYbvrEMN2ZKyeDGAMAxdcNkmO2QSZJsE/1/public/full?alt=json&date=' + dateCode

	$: coviddata = [];

	const parseTime = timeParse("%m/%d/%y");
	const formatDate = timeFormat("%m/%d/%y");


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

	const headings = ["Date", "Tests Completed", "Positive Tests", "Negative Tests", "Students Positive",	"FacStaff Positive",	"Contracted Positive",  "Students in Isolation On Campus",	"Students in Isolation Off Campus", "Students in Quarantine On Campus",	"Students in Quarantine Off Campus",	"Students Recovered On Campus",	"Students Recovered Off Campus", "Mass. Positive Rate", "Seven-Day Tests", "Seven-Day Positive", "Seven-Day Negative", "Total Tests", "Total Positive", "Total Negative", "Total Students Positive",	"Total FacStaff Positive",	"Total Contracted Positive"]

	json(url).then(function(data,i){
		let rowcount = ((data.feed.entry.length / headings.length)-1)
		let loadeddata = []

		for (let r=0; r < rowcount; r++) {
			loadeddata[r] = {}
		}

		data.feed.entry.filter(d => (d.gs$cell.row !== "1")).forEach(function(d,i){
			let colno = parseFloat([d.gs$cell.col])-1

			if (colno === 0) {
				loadeddata[parseFloat([d.gs$cell.row])-2][headings[colno]] = formatDate(parseTime(d.gs$cell.inputValue))
			} else if (colno > 6 && colno < 14) {
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
	    value: v => new Date(v["Date"]),
		 renderValue: v => v["Date"],
	    sortable: true,
	    headerClass: "text-left",
		 class: "date-col"
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
	  }
  ]


</script>

<style>
	#dashboard-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr 1fr;
	  grid-template-rows: 1fr auto;
	  gap: 20px 60px;
	  grid-template-areas: "dash-brief dash-brief dash-brief" "dash-wellness dash-wellness dash-wellness" "dash-bars dash-bars dash-donut" "dash-table dash-table dash-table";
	  margin-bottom:15px;
	}

	@media screen and (max-width:600px) {
		#dashboard-grid {
			grid-template-columns: 1fr;
		 	  grid-template-rows: 1fr;
		 	  gap: 40px 60px;
			grid-template-areas: "dash-brief" "dash-wellness" "dash-bars" "dash-donut" "dash-table";
		}

		.dash-table {
			overflow:scroll;
		}
	}

	.dash-wellness { grid-area: dash-wellness; }

	.dash-brief { grid-area: dash-brief; }

	.dash-bars { grid-area: dash-bars; }

	.dash-donut { grid-area: dash-donut; }

	.dash-table { grid-area: dash-table; }

	.dashboard-grid-item {
		margin-bottom:2rem;
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
		<div class="dashboard-grid-item dash-wellness">
			<GraphicTitle
				title={"Wellness and Contact Tracing"}
			/>
			<WellnessSummary
				data={coviddata}
			/>
		</div>
		<div class="dashboard-grid-item dash-bars" id="column-chart-container">
			<GraphicTitle
				title={"Test Results by Date"}
			/>
			<StackedColumnChart
				width={width2}
				height={width2 * 1}
				data={coviddata}
				xVar={"Date"}
				yVar={"Tests Completed"}
				yGroups={["Negative Tests", "Positive Tests"]}
				colorscheme={negativepositive}
			/>
			<!-- <StackedColumnChart
				width={width2}
				height={width2 * 0.45}
				data={coviddata}
				xVar={"Date"}
				yVar={"Positive Tests"}
				yGroups={["Students Positive", "FacStaff Positive", "Contracted Positive"]}
				colorscheme={groupbylevel}
			/>
			<LineChart
				width={width2}
				height={width2 * 0.45}
				data={coviddata}
				title={"Title"}
				xVar={"Date"}
				lineA={"Negative Tests"}
				lineB={"Inconclusive Tests"}
				lineC={"Positive Tests"}
			/> -->
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
	source={"Northeastern Life Sciences Testing Center and the Broad Institute"}
	note={""}
/>
