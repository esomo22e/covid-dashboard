<script>
	import { onMount } from 'svelte';
	import { colors } from '../helpers/colors.js'

	let el;

	export let data = {data};
	data = data[data.length-1]; // only get the latest day's info
</script>

<style>
	#wellness-summary {
		display: grid;
 	   grid-template-columns: repeat(6, 1fr);
		grid-template-rows: auto;
		gap: 20px 20px;
		grid-template-areas: ". . ." ". ."
	}

	.summary-item:nth-child(1) { grid-area: 1 / 1 / 2 / 3; }
	.summary-item:nth-child(2) { grid-area: 1 / 3 / 2 / 5; }
	.summary-item:nth-child(3) { grid-area: 1 / 5 / 2 / 7; }
	.summary-item:nth-child(4) { grid-area: 2 / 2 / 3 / 4; }
	.summary-item:nth-child(5) { grid-area: 2 / 4 / 3 / 6; }



	.summary-item {
	  display: grid;
	  grid-template-columns: repeat(3, 1fr);
	  grid-template-rows: 0.33fr 1fr;
	  gap: 0.5rem 10px;
	  background-color: #F7F7F7;
     padding: 10px;
	  border-radius:3px;
	}

	.summary-item h3 { grid-area: 1 / 1 / 2 / 4; }

	.datapt:nth-child(2) { grid-area: 2 / 1 / 3 / 2; }

	.datapt:nth-child(3)  { grid-area: 2 / 2 / 3 / 3; }

	.datapt:nth-child(4)  { grid-area: 2 / 3 / 3 / 4; }




	#wellness-summary h3 {
		font-size:0.875rem;
		color: #D41B2C;
		font-weight: 700;
		margin:0;
		text-align:left;
	}

	.datapt h4 {
		text-transform:uppercase;
		font-size:0.6rem;
		color: #666;
	    display: block;
	    height: 1rem;
		 margin:0.5rem 0 0.2rem 0;
		 position:relative;
	}

	.datapt h4 > span {
		position:absolute;
		bottom:0;
		left:0;
	}



	@media screen and (max-width:600px) {
		#wellness-summary {
	 	   grid-template-columns: 1fr;
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
		<h3>Wellness Beds</h3>
		<div class="datapt">
			<h4><span>In Use</span></h4>
			<div>24</div>
		</div>
		<div class="datapt">
			<h4><span>Available</span></h4>
			<div>552</div>
		</div>
	</div>
	<div class="summary-item">
		<h3>Students in Isolation</h3>
		<div class="datapt">
			<h4><span>On Campus</span></h4>
			<div>7</div>
		</div>
		<div class="datapt">
			<h4><span>Off Campus</span></h4>
			<div>14</div>
		</div>
	</div>
	<div class="summary-item">
		<h3>Students Recovered</h3>
		<div class="datapt">
			<h4><span>On Campus</span></h4>
			<div>7</div>
		</div>
		<div class="datapt">
			<h4><span>Off Campus</span></h4>
			<div>-</div>
		</div>
	</div>
	<div class="summary-item">
		<h3>Students Currently in Quarantine, On Campus</h3>
		<div class="datapt">
			<h4><span>Newly Identified</span></h4>
			<div>0</div>
		</div>
		<div class="datapt">
			<h4><span>Traced Contacts</span></h4>
			<div>17</div>
		</div>
		<div class="datapt">
			<h4><span>Self-Reported</span></h4>
			<div>0</div>
		</div>
	</div>
	<div class="summary-item">
		<h3>Students Currently in Quarantine, Off Campus</h3>
		<div class="datapt">
			<h4><span>Newly Identified</span></h4>
			<div>6</div>
		</div>
		<div class="datapt">
			<h4><span>Traced Contacts</span></h4>
			<div>41</div>
		</div>
		<div class="datapt">
			<h4><span>Self-Reported</span></h4>
			<div>4</div>
		</div>
	</div>
</div>
