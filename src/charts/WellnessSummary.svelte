<script>
	import { onMount } from 'svelte';
	import { digitFormat } from '../helpers/digitFormat.js'

	let el;

	export let data = {data};
	data = data[data.length-1]; // only get the latest day's info
</script>

<style>
	#wellness-summary {
		display: grid;
 	   grid-template-columns: repeat(3, 1fr);
		grid-template-rows: auto;
		gap: 20px 20px;
		grid-template-areas: ". . ." "update-line update-line update-line"
	}

	.update-line { grid-area: update-line; }

	.summary-item {
	  display: grid;
	  grid-template-columns: repeat(2, 1fr);
	  grid-template-rows: 0.33fr 1fr;
	  gap: 0.5rem 10px;
	  background-color: #e0ecf4;
     padding: 10px;
	  border-radius:3px;
	}

	.summary-item h3 { grid-area: 1 / 1 / 2 / 4; }
	.datapt:nth-child(2) { grid-area: 2 / 1 / 3 / 2; }
	.datapt:nth-child(3)  { grid-area: 2 / 2 / 3 / 3; }


	#wellness-summary h3 {
		font-size:0.95rem;
		color: #6e016b;
		font-weight: 700;
		margin:0;
		text-align:left;
	}

	.datapt h4 {
		text-transform:uppercase;
		font-size:0.6rem;
		color: #555;
	    display: block;
	    height: 1rem;
		 margin:0.5rem 0 0.2rem 0;
		 position:relative;
		 border:unset;
		 letter-spacing:unset;
	}

	.datapt h4 > span {
		position:absolute;
		bottom:0;
		left:0;
	}

	.datapt > div {
		font-weight:700;
	}

	@media screen and (max-width:600px) {
		#wellness-summary {
	 	   display:block;
		}

		.summary-item {
			margin-bottom:0.5rem
		}

		.summary-item:nth-child(1) { grid-area: unset; }
		.summary-item:nth-child(2) { grid-area: unset; }
		.summary-item:nth-child(3) { grid-area: unset; }
		.summary-item:nth-child(4) { grid-area: unset; }
		.summary-item:nth-child(5) { grid-area: unset; }


	}
</style>

<div bind:this={el} class="wellness-summary" id="wellness-summary">
<div class="summary-item">
	<h3>Students Recovered</h3>
	<div class="datapt">
		<h4><span>On Campus</span></h4>
		<div>{digitFormat(data["Students Recovered On Campus"])}</div>
	</div>
	<div class="datapt">
		<h4><span>Off Campus</span></h4>
		<div>{digitFormat(data["Students Recovered Off Campus"])}</div>
	</div>
</div>
	<div class="summary-item">
		<h3>Students in Quarantine</h3>
		<div class="datapt">
			<h4><span>On Campus</span></h4>
			<div>{digitFormat(data["Students in Quarantine On Campus"])}</div>
		</div>
		<div class="datapt">
			<h4><span>Off Campus</span></h4>
			<div>{digitFormat(data["Students in Quarantine Off Campus"])}</div>
		</div>
	</div>
	<div class="summary-item">
		<h3>Students in Isolation</h3>
		<div class="datapt">
			<h4><span>On Campus</span></h4>
			<div>{digitFormat(data["Students in Isolation On Campus"])}</div>
		</div>
		<div class="datapt">
			<h4><span>Off Campus</span></h4>
			<div>{digitFormat(data["Students in Isolation Off Campus"])}</div>
		</div>
	</div>

</div>
<!-- <p class="update-line"><i>Beginning on September 25th, off-campus students are encouraged to isolate and quarantine in on-campus wellness housing.</i></p> -->
