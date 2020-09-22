<script>
	import { onMount } from 'svelte';
	import Brief from './charts/BriefHomepage.svelte'
	import { csv, json } from 'd3-fetch'
	import { timeParse, timeFormat } from 'd3-time-format';

	const todaysDate = new Date();
	const dateCode = todaysDate.getTime()

	const url = 'https://spreadsheets.google.com/feeds/cells/1C8PDCqHB9DbUYbvrEMN2ZKyeDGAMAxdcNkmO2QSZJsE/1/public/full?alt=json&date=' + dateCode


	$: coviddata = [];

	const parseTime = timeParse("%-m/%d/%y");
	const formatDate = timeFormat("%-m/%d/%y");

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

		let len = loadeddata.length;


		for (let k=0; k < (len-31); k++) {
			console.log(k)
			loadeddata.shift()
		}

		coviddata = loadeddata;
	})


</script>

<style>

</style>


{#if coviddata.length > 0}
			<Brief
				data={coviddata}
			/>
{/if}
