<script>
	import { onMount } from 'svelte';
	import Brief from './charts/Brief.svelte'
	import { csv } from 'd3-fetch'

	$: coviddata = [];

	csv("//news.northeastern.edu/interactive/2020/08/covid-testing-dashboard/datasets/testingdata.csv").then(function(data,i){
	// csv("datasets/testingdata.csv").then(function(data,i){
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

	}

	.dash-brief { grid-area: dash-brief; }



</style>


{#if coviddata.length > 0}
	<div id="dashboard-grid">
		<div class="dashboard-grid-item dash-brief">
			<Brief
				data={coviddata}
			/>
		</div>
	</div>
{/if}
