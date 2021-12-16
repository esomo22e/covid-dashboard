<script>
	import { digitFormat } from '../helpers/digitFormat.js';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let label = { label };
	export let data = { data };
	export let dataLabels = { dataLabels };
	export let hasAccent = false;

	let el;
	let classNames = [
		'graph',
		'wellness-summary-graph',
	];
	if ( hasAccent ) {
		classNames.push( 'has-accent' );
	}

	function getClassNames () {
		return classNames.join( ' ' );
	}

	onMount( () => {
		const figure = d3.select( el );
		const locationList = figure.select( '.wellness-summary__location-list' );
		for ( let i = 0; i < dataLabels.length; i++ ) {
			let location = locationList.select( '.wellness-summary__location' );
			location.select( '.data-category' ).html( dataLabels[ i ] );
			location.select( '.data-label' )
			        .text( digitFormat( parseInt( data[ i ] ) ) );
			locationList.node().appendChild( location.node().cloneNode( true ) );
		}
		// remove the original
		locationList.select( '.wellness-summary__location' ).remove();
	} );
</script>

<figure bind:this={el} class="{getClassNames()}">
    <div id="source"></div>
    <h3 class="graph-title">{label}</h3>
    <div class="wellness-summary__location-list">
        <div class="wellness-summary__location">
            <h4 class="data-category">Category</h4>
            <div class="data-label">Label</div>
        </div>
    </div>
</figure>