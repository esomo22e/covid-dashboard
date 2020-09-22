<script>
	import { onMount } from 'svelte';

	let el;

	export let data = {data};
	data = data[data.length-1]; // only get the latest day's info
</script>

<style>
	#homepagebrief {
		text-align:center;
		color:white;
	}

	#homepagebrief .brief-grid-item {
		display:block;
		margin:0 auto 2rem;
	}

	#homepagebrief h3 {
		font-size:1rem;
		margin:0 auto;
	}

	#homepagebrief span.brief-stat {
		font-size:2rem;
		font-weight:bold;
	}



	/* @media screen and (max-width:600px) {
		#brief {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
			gap: 10px 10px;
			grid-template-areas: ". ." ". .";
		}

		#breakdown {
			margin-top:2.3rem
		}

		h3.posheader {
			/* position:relative;
			left:50%;
		}
	}*/
</style>

<div bind:this={el} class="homepagebrief" id="homepagebrief">
	<div class="brief-grid-item">
		<h3>Tests Completed</h3>
		<span class="brief-stat">{(data["Total Tests"]).toLocaleString('en-US')}</span>
	</div>
	<div class="brief-grid-item">
		<h3>Negative Tests</h3>
		<span class="brief-stat">{(data["Total Negative"]).toLocaleString('en-US')}</span>
	</div>
	<div class="brief-grid-item">
		<h3 class="posheader">Positive Tests</h3>
		<span class="brief-stat">{(data["Total Positive"]).toLocaleString('en-US')}</span>
	</div>
</div>
