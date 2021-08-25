<script>
	import { onMount } from 'svelte';


	import StackedColumnChart from './charts/StackedColumnChart.svelte'
	import StackedColumnChart2 from './charts/StackedColumnChart2.svelte'
	import WellnessSummary from './charts/WellnessSummary.svelte'

	import DonutChart from './charts/DonutChart.svelte'
	import WaffleChart from './charts/WaffleChart.svelte'

	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
   import SvelteTable from "svelte-table"
	import { csv, json } from 'd3-fetch'
	import { groups } from 'd3-array'
	import { timeParse, timeFormat } from 'd3-time-format';
	import { negativepositive, groupbylevel } from './helpers/colors.js'
	import * as waffledata from '../public/datasets/waffledata.json'
	import * as testData from '../public/datasets/testingdata2.json'

  // import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  // import beyonkSvelteCalendar from 'https://cdn.skypack.dev/@beyonk/svelte-calendar';
  import Datepicker from 'svelte-calendar';
  // let formattedSelected = new Date();

  const todaysDate = new Date();
  const dateCode = todaysDate.getTime();
      // Set this at midnight (local time zone)
      // const today = new Date();
      todaysDate.setHours(0);
      todaysDate.setMinutes(0);
      todaysDate.setSeconds(0);
      todaysDate.setMilliseconds(0);
  let formattedSelected = todaysDate;
  // let testDate = "09/01/21"
  // console.log(testDate)
  // console.log(formattedSelected)
  let dateChosen = false;


		console.log(waffledata.default[0])


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


	});


	// $: filteredData = coviddata.filter(d => (["8/20/20", "9/1/20", "9/6/20"].indexOf(d["Date"]) > -1));
	// console.log(filteredData)
// $: filteredData = coviddata.filter(function(d){
// 	// console.log(formattedSelected)
// 	// console.log(d.Date)
// 	if(d.Date >= formatDate(formattedSelected) && d.Date <= "09/01/21") {
// 		console.log(d.Date)
// 		return d;
// 	}
// });
// console.log(filteredData0);
// $: filteredData = coviddata.filter(d => ([formatDate(formattedSelected)].indexOf(d["Date"]) > -1));
$: filteredData = coviddata.filter(function(d){
	const START_DATE = new Date(formattedSelected).getTime();
	const END_DATE = new Date("09/01/21").getTime();
	const COMPARE_DATE = new Date(d.Date).getTime();
	if(COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE) {
		// console.log(END_DATE)
		// console.log("Date", new Date(COMPARE_DATE).toString(),d);
		// console.log("Date", new Date(COMPARE_DATE).toString());

		console.log(d.Date)
		return d;
	}
});

console.log(filteredData)


// $: filteredData = coviddata.filter(function(d){
// // console.log('filtering');
// // console.log("formattedSelected", formattedSelected)
// // 	if ("08/18/2021" === formattedSelected || "" === formattedSelected) {
// // 		return d;
// // 	} else {
// // 		return;
// // 	}
// 	if(0 < formattedSelected.length ) {
// 		// const START_DATE = new Date(formattedSelected).getTime();
// 		const START_DATE = new Date("08/17/21").getTime();
// 		// console.log(START_DATE)
// 		const END_DATE = new Date("09/1/21").getTime();
// 		const COMPARE_DATE = new Date(d.Date).getTime();
// 		// console.log("COMPARE_DATE", new Date(COMPARE_DATE).toString());
// 		// console.log("START_DATE", new Date(START_DATE).toString());
// 		// console.log("END_DATE", new Date(END_DATE).toString());
// 		if(COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE) {
// 			console.log("Including Datum", d);
// 			return d;
// 		}
// 	} else {
// 		return d;
// 	}
//
// });
// console.log(filteredData)
	// NEED THESE TO CYCLE THROUGH THE HEADERS OF THE GOOGLE SHEET





	// I can't figure out a better way to dynamically figure out the width of CSS grid items, so here we are
	let width = document.getElementById('covid-testing-dashboard').getBoundingClientRect().width;
	let width_donut = Math.min(width, 250);
	let width_stacked = Math.min(width, 250);
	let height = Math.min(width, 500);

	if (window.innerWidth > 600) {
		width_donut = width * 0.22;
		width_stacked = (width * 0.5)
		height = width * 0.65;
	}


	// These are the columns for the table portion; this configuration is passed to the SvelteTable plugin
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

	.dash-test { grid-area: dash-test; }
	.dash-positive { grid-area: dash-positive; }
	/* .dash-donut { grid-area: dash-donut; } */
	.dash-variants { grid-area: dash-variants; }
	.dash-vac-rate { grid-area: dash-vac-rate; }
	.dash-wellness { grid-area: dash-wellness; }
	.dash-table { grid-area: dash-table; }

	#dashboard-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr ;
	  grid-template-rows: 1fr auto;
	  /* gap: 0 60px; */
	  grid-template-areas:
		  "dash-test"
		  "dash-positive"
		  "dash-variants"
		  "dash-vac-rate"
		  "dash-wellness"
		 "dash-table"
		;
	  margin-bottom:15px;
	}

	.dashboard-grid-item {
	margin-bottom:2rem;
	}



.dash-test{
	display: grid;
	grid-auto-rows: 1fr;
	 grid-template-columns: 1.5fr 0.5fr;
	 grid-template-columns: 1.2fr 0.8fr;
	grid-template-rows: 1fr;
	gap: 0px 40px;
	grid-template-areas:
	  "dash-stats dash-bars";
	  grid-area: positive;
 	/*grid-template-rows: 1fr auto;
	gap: 0px 0px;
	grid-template-areas:
	  "dash-stats dash-bars";
	grid-area: positive; */
}
.dash-stats{
	display: grid;
grid-template-columns: 1fr;
grid-template-rows: 1fr 1fr 1fr;
gap: 10px 0px;
grid-template-areas:
  "."
  "."
  ".";

}

#dash-stats-item{
	padding: 10px;
}
.donut-item{
	display:flex;
	background-color: #e0ecf4;
	/* padding: 10px; */
 /* display: grid;
 grid-template-columns: 0.2fr 1.8fr;
 grid-template-rows: 1fr;
 gap: 0px 0px;
 grid-template-areas:
   ". ."; */
 /* grid-area: dash-test;  */
}

.dash-brief{
	color: #f7fcfd;
	background-color:#6e016b;
	/* padding: 10px */
	/* padding: 20px; */
}

.covid-links {
	display: flex;
}

.covid-links a{
	font-weight: 600;
	color: #f7fcfd;
	margin: 0 10px;
}



		/*


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

	}

	.cell1{
		width: 100%;
		height: 10px;
			background-color: #b3cde3;
	}

	.cell2{
		width: 100%;
		height: 10px;

		background-color: #6e016b;

	}

	.donut-item{
		display: flex;
		background-color: #e0ecf4;
		margin: 10px 0;
		padding: 30px;

	}
	 .dash-brief{
		 color: #fff;
		 background-color:#6e016b;
		 padding: 20px;
	 }

	.dash-donut-positive{
		display: flex;
		max-width: 50%;
		margin: 0 auto;
	}

	.donut-positive-item{
		margin: 1em 2em;
	}

	.dash-donut-vaccination{
		display: flex;
	}
	.dash-brief{
		color: #f7fcfd;
		background-color:#6e016b;
		padding: 20px;
	}

	p.update-line-brief{
		color: #f7fcfd
	}

	.covid-links {
		display: flex;
	}

	.covid-links a{
		font-weight: 600;
		color: #f7fcfd;
		margin: 0 10px;
	} */

	/* .dash-brief{
		background: lavender;
		padding: 30px;
	} */
	/* p.seven-line-2{
		display: none;
	}

	p.seven-line{
		display: block;
	} */
/*
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





</style>

{#if coviddata.length > 0}
	<div id="dashboard-grid">

<!-- Dash Test Information - hospitalization, 7 day testing, and stacked bar chart -->
	<div class="dashboard-grid-item dash-test">

	<!-- Dashboard Donut Chart For the week and Get Tested (so stats of covid)-->
<div class = "dash-stats" id = "dash-test-item">
	<div class = "donut-item" id = "dash-stats-item">

		<DonutChart
			width={width_donut}
			height={width_donut}
			data={coviddata}
			xVar={"Date"}
			yVar={"Samples Taken"}
			yA={"Tests Completed"}
			yB={"Tests in Progress"}
		/>

		<div class = "donut-content">
		<h3>Hospitalizations</h3>
		<p class="update-line"><i>Suspendisse egestas est metus, sit amet ultricies magna blandit vitae. Nam quis leo at arcu ultricies bibendum. Curabitur fringilla arcu ligula, ac suscipit purus scelerisque nec. Proin lacinia efficitur consequat.</i></p>
		</div>
		</div>


		<div class = "donut-item" id = "dash-stats-item">

		<DonutChart
			width={width_donut}
			height={width_donut}
			data={coviddata}
			xVar={"Date"}
			yVar={"Samples Taken"}
			yA={"Tests Completed"}
			yB={"Tests in Progress"}
		/>

		<div class = "donut-content" id = "dash-stats-item">
		<h3>Seven-Day Positive Test</h3>
		<p class="update-line"><i>Suspendisse egestas est metus, sit amet ultricies magna blandit vitae. Nam quis leo at arcu ultricies bibendum. Curabitur fringilla arcu ligula, ac suscipit purus scelerisque nec. Proin lacinia efficitur consequat.</i></p>
		</div>
		</div>

		<div class="dash-brief" id = "dash-stats-item">

			<h3>Get Tested</h3>

			 <p class="update-line-brief"><i>Suspendisse egestas est metus, sit amet ultricies magna blandit vitae. Nam quis leo at arcu ultricies bibendum. Curabitur fringilla arcu ligula, ac suscipit purus scelerisque nec. Proin lacinia efficitur consequat.</i></p>
			 <div class = "covid-links">
			 <p class = "schedule-test"><a href = "https://northeastern.sharepoint.com/sites/covidscheduler/SitePages/Home.aspx?wa=wsignin1.0">Schedule a Test</a></p>
			 <p class = "wellness-check"><a href = "https://neuidmsso.neu.edu/idp/profile/SAML2/Redirect/SSO?execution=e3s1">Daily Wellness Check</a></p>
			 </div>
		</div>
		</div>

		<!-- Dashboard Stacked Bar Chart -->

		<div class="dash-bars" id = "dash-test-item">
			<GraphicTitle
				title={"Test Results by Date"}
			/>
			<!-- <input bind:value={formattedSelected}> -->
			<!-- <button on:click={() => addNode()}>Add Node</button> -->
			<div id = "button-chart-container">
			<button>7 Days</button>
			<button>30 Days</button>
			<button>Semester</button>
			<button>Custom</button>
			</div>
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
			<!-- {console.log(filteredData)} -->
			<StackedColumnChart

				width={width_stacked}
				height={height}
				data={filteredData}
				xVar={'Date'}
				yVar={"Seven-Day Tests"}
				yGroups={["Seven-Day Negative", "Seven-Day Positive"]}
				colorscheme={negativepositive}
			/>


		</div>


		</div>



		<div class="dashboard-grid-item dash-positive">
		fff
		</div>









</div>


{/if}
<GraphicFooter
	source={"Northeastern Life Sciences Testing Center and the Broad Institute"}
	note={""}
/>
