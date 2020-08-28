<script>
	import { onMount } from 'svelte';
	import { colors } from '../helpers/colors.js'

	let el;

	export let data = {data};

	let newdata= data.reduce(function(previousValue, currentValue) {
	  return {
		  "Tests Completed": previousValue["Tests Completed"] + currentValue["Tests Completed"],
		  "Negative Tests": previousValue["Negative Tests"] + currentValue["Negative Tests"],
	    "Positive Tests": previousValue["Positive Tests"] + currentValue["Positive Tests"]
	  }
});

	data = newdata
</script>

<style>
	#brief {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 0.5fr;
		gap: 10px 10px;
		grid-template-areas: ". . .";
	}

	.brief-grid-item {
		text-align:center;
		padding:0;
	}



	.brief-grid-item h3 {
		font-size:1rem;
		color: #D41B2C;
		font-weight: 700;
		margin:0 auto ;
	}

	.brief-grid-item span.brief-stat {
		font-size:1.3rem;
		color: #333;
		font-weight: 700;
		width:100px;
		display:block;
		margin:0 auto;
		padding:35px 0;
	}

	.brief-grid-item:nth-child(1) span.brief-stat {
		background:  no-repeat center/75% url('../img/brief1.png');
	}
	.brief-grid-item:nth-child(2) span.brief-stat {
		background: no-repeat center/75% url('../img/brief2.png');
	}
	.brief-grid-item:nth-child(3) span.brief-stat {
		background: no-repeat center/75% url('../img/brief3.png');
	}
	.brief-grid-item:nth-child(4) span.brief-stat {
		background: no-repeat center/75% url('../img/brief4.png');
	}



	#breakdown {
		display: grid;
		grid-template-columns: 6fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		gap: 4px;
		grid-template-areas: ". ." ". ." ". .";
		width: 150px;
    	margin: 0.25rem auto 1.5rem;
    	padding: 0;
	}

	#breakdown div {
		margin:0;
		padding:0;
		font-size:0.8rem;
		text-align:left;
	}

	#breakdown div.number {
		margin:0;
		padding:0;
		font-size:0.75rem;
		text-align:left;
	}

	@media screen and (max-width:600px) {
		#brief {
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-rows: 1fr;
			gap: 10px 10px;
			grid-template-areas: ". . .";
		}
	}
</style>

<div bind:this={el} class="brief" id="brief">
	<div class="brief-grid-item">
		<h3>Tests Completed</h3>
		<span class="brief-stat">{data["Tests Completed"]}</span>
	</div>
	<div class="brief-grid-item">
		<h3>Negative Tests</h3>
		<span class="brief-stat">{data["Negative Tests"]}</span>
	</div>
	<div class="brief-grid-item">
		<h3>Positive Tests</h3>
		<span class="brief-stat">{data["Positive Tests"]}</span>
		<div id="breakdown">
			<div>Students:</div>
			<div>6</div>
			<div>Faculty/Staff:</div>
			<div>1</div>
			<div>Contract Employees:</div>
			<div>0</div>
		</div>
	</div>

</div>
