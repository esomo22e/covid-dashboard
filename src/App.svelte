<script>
	import { onMount } from 'svelte';

	import DotPlot from './charts/DotPlot.svelte'

	import StackedColumnChart from './charts/StackedColumnChart.svelte'
	import DonutChart from './charts/DonutChart.svelte'

	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
   import SvelteTable from "svelte-table"
	import { csv, json } from 'd3-fetch'
	import { groups } from 'd3-array'
	import { timeParse, timeFormat } from 'd3-time-format';
	import { negativepositive, groupbylevel } from './helpers/colors.js'

  // import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  // import beyonkSvelteCalendar from 'https://cdn.skypack.dev/@beyonk/svelte-calendar';
  import Datepicker from 'svelte-calendar';

  let formattedSelected = "";
  let dateChosen = false;


	const todaysDate = new Date();
	const dateCode = todaysDate.getTime();

	const url = 'https://spreadsheets.google.com/feeds/cells/1REJNqVcREni8IlxiObIbm5M6xU0lb8BeKfxJO0lNvXk/1/public/full?alt=json&date=' + dateCode

	// the dollar sign is a Svelte-y way of declaring a variable that will be dynamic
	$: coviddata = [];

	const parseTime = timeParse("%m/%d/%y");
	const formatDate = timeFormat("%m/%d/%y");


	csv("datasets/testingdata.csv").then(function(data,i){
	// csv("//news.northeastern.edu/interactive/2020/08/covid-testing-dashboard-weekly/datasets/testingdata.csv").then(function(data,i){
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

		// console.log(coviddata)

	});


	// $: filteredData = coviddata.filter(d => {(["8/20/20"].indexOf(d["Date"]) > -1)});
// $: filteredData0 = coviddata.filter(function(d){
// 	// console.log(formattedSelected)
// 	console.log(d.Date)
// 	if(d.Date >= formattedSelected && d.Date <= "09/1/21") {
// 		return d;
// 	}
// });
// console.log(filteredData0);
// $: filteredData = coviddata.filter(d => {(["8/20/20"].indexOf(d["Date"]) > -1)});
// $: filteredData = coviddata.filter(function(d){
// 	const START_DATE = new Date(formattedSelected).getTime();
// 	const END_DATE = new Date("09/1/21").getTime();
// 	const COMPARE_DATE = new Date(d.Date).getTime();
// 	if(COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE) {
// 		// console.log(END_DATE)
// 		// console.log("Date", new Date(COMPARE_DATE).toString(),d);
// 		// console.log("Date", new Date(COMPARE_DATE).toString());
//
// 		console.log(d)
// 		return d;
// 	}
// });


$: filteredData = coviddata.filter(function(d){
console.log('filtering');
console.log("formattedSelected", formattedSelected)
	if ("08/18/2021" === formattedSelected || "" === formattedSelected) {
		return d;
	} else {
		return;
	}
	if(0 < formattedSelected.length ) {
		// const START_DATE = new Date(formattedSelected).getTime();
		const START_DATE = new Date("08/17/21").getTime();
		// console.log(START_DATE)
		const END_DATE = new Date("09/1/21").getTime();
		const COMPARE_DATE = new Date(d.Date).getTime();
		console.log("COMPARE_DATE", new Date(COMPARE_DATE).toString());
		console.log("START_DATE", new Date(START_DATE).toString());
		console.log("END_DATE", new Date(END_DATE).toString());
		if(COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE) {
			console.log("Including Datum", d);
			return d;
		}
	} else {
		return d;
	}
///

});
// console.log(filteredData)
	// NEED THESE TO CYCLE THROUGH THE HEADERS OF THE GOOGLE SHEET





	// I can't figure out a better way to dynamically figure out the width of CSS grid items, so here we are
	let width = document.getElementById('covid-testing-dashboard-weekly').getBoundingClientRect().width;
	let width1 = Math.min(width, 350);
	let width2 = width;

	if (window.innerWidth > 600) {
		width1 = width * 0.33;
		width2 = (width * 0.66) - 60
	}





</script>

<style>
	.dash-wellness { grid-area: dash-wellness; }
	.dash-brief { grid-area: dash-brief; }
	.dash-bars { grid-area: dash-bars; }
	.dash-donut { grid-area: dash-donut; }
	.dash-table { grid-area: dash-table; }

	.dashboard-grid-item {
		margin-bottom:2rem;
	}

	#dashboard-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr 1fr;
	  grid-template-rows: 1fr auto;
	  gap: 0 60px;
	  grid-template-areas:
		  "dash-brief dash-brief dash-brief"
		  "dash-wellness dash-wellness dash-wellness"
		  "dash-bars dash-bars dash-donut"
		  "dash-table dash-table dash-table"
		;
	  margin-bottom:15px;
	}


	.dashboard-legend{
		display: flex;
		padding: 10px 0;
	}

	.legendCells{
		width: 100%;
		padding: 0 50px 0 0;
	}

	.cell-label{
		text-anchor: middle;
		font-size: 0.65rem;
	    color: #777;
	    text-transform: uppercase;
		padding: 10px 0;
		text-align: center;
		font-family: "akkurat", -apple-system, sans-serif;
		/* opacity: 50%; */

	}

	.cell1{
		width: 100%;
		height: 10px;
			background-color: rgb(136, 199, 240);
	}

	.cell2{
		width: 100%;
		height: 10px;

		background-color: rgb(212, 27, 44);

	}

	/* p.seven-line-2{
		display: none;
	}

	p.seven-line{
		display: block;
	} */

	@media screen and (max-width:600px) {
		#dashboard-grid {
			grid-template-columns: 1fr;
		 	grid-template-rows: 1fr;
		 	gap: 40px 60px;
			grid-template-areas:
				"dash-brief"
				"dash-wellness"
				"dash-bars"
				"dash-donut"
				"dash-table"
			;
		}

		.dash-table {
			overflow:scroll;
		}

		/* p.seven-line{
			display: none;
		}

		p.seven-line-2{
			display: block;
		} */

	}



</style>

{#if coviddata.length > 0}
	<div id="dashboard-grid">
	<div class="dashboard-grid-item dash-brief">
		<!-- <Brief
			data={coviddata}
		/> -->
		<p class="update-line"><i>Last updated 5/25/21. The results for the previous week (Sunday-Saturday) are posted every Tuesday.</i></p>

		 <!-- <p class="update-line"><i>Updated weekly with the latest available numbers. Data includes students, faculty, staff, and contract employees.</i></p> -->
	</div>

		<div class="dashboard-grid-item dash-bars" id="column-chart-container">
			<GraphicTitle
				title={"Test Results by Week"}
			/>
			<!-- <input bind:value={formattedSelected}> -->

			<Datepicker bind:formattedSelected bind:dateChosen>
  <button class='custom-button'>
 {formattedSelected}
  </button>

</Datepicker>


			<div class = "dashboard-legend">
			<div class ="legendCells">
			<div class = "cell1"></div>
			<div class = "cell-label">NEGATIVE TESTS</div>

			</div>
			<div class ="legendCells">
			<div class = "cell2"></div>
			<div class = "cell-label">POSITIVE TESTS</div>

			</div>

			</div>
			<!-- {console.log(filteredData0)} -->

			{console.log(filteredData)}
			<StackedColumnChart

				width={width2}
				height={width2 * 1}
				data={filteredData}
				xVar={'Date'}
				yVar={"Seven-Day Tests"}
				yGroups={["Seven-Day Negative", "Seven-Day Positive"]}
				colorscheme={negativepositive}
			/>

			<p class="seven-line"><i>Each bar represents seven days of testing data, Sunday-Saturday, starting on the date noted.</i></p>

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
		<!-- <DotPlot
data={coviddata}
width = {width}
height = {width}
datapoints={["Tests Completed", "Tests in Progress"]}
category={"Date"}
/> -->
		</div>

		<!-- <p class="seven-line"><i>Each bar represents seven days of testing data, Sunday-Saturday, starting on the date noted.</i></p> -->

		<!-- <div class="dashboard-grid-item dash-wellness">
			<GraphicTitle
				title={"Wellness and Contact Tracing"}
			/>
			<WellnessSummary
				data={coviddata}
			/>
		</div> -->
		<!-- <div id="dashboard-grid">

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

	</div> -->


{/if}
<GraphicFooter
	source={"Northeastern Life Sciences Testing Center and the Broad Institute"}
	note={""}
/>
