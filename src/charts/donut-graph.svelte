<script>
	/**
	 * Creates a donut graph with a title and data label.
	 *
	 * @file   This file provides a donut graph.
	 * @since  1.0
	 */
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let width = { width };
	export let label = { label };
	export let hasAccent = false;
	export let isPercent = false;
	export let values = { dataValues: values };
	export let thickness = { thickness };
	const height = width; // exists to keep parameters obvious
	const radius = Math.min( width, height ) / 2;
	let el;
	let valueStyleParams = {};
	let innerText = '';

	// Sets the text inside of the donut graph. Will calculate percentage if isPercent is true.
	if ( isPercent ) {
		values[0] = ( 0 === values[ 0 ] || 0 === values[ 1 ] ) ?
            0 :
            values[ 0 ] / values[ 1 ];
		values[1] = 100;

			valueStyleParams = { style: 'percent', minimumFractionDigits: 2 };
		innerText = (values[ 0 ]).toLocaleString( undefined, valueStyleParams );
	}
	else {
		innerText = ( values[ 0 ] ).toLocaleString( undefined, valueStyleParams );
	}
	// Computes the position of each group on the pie.
	const pie = d3.pie()
	              .value( function ( d ) {
		              return d;
	              } );
	// Generates the graph visual.
	onMount( () => {
		console.log( 'values in onMount()', values );
		console.log( 'el in onMount()', el );

		const graphContainer = d3.select( el );
		// Specifies if the graph has an accent.
		if ( hasAccent ) {
			graphContainer.classed( 'has-accent', true );
		}
		// Sets boundaries for the graph.
		const graphVisual = graphContainer.select( '.graph-visual' )
		                                  .style( 'max-width', `${ width }px` )
		                                  .style( 'max-height', `${ height }px` )
		                                  .attr( 'viewBox',
		                                         `0 0 ${ width } ${ height }`,
		                                  )
		                                  .attr( 'aria-label',
		                                         `${ innerText } ${ label }`,
		                                  )
		                                  .attr( 'preserveAspectRatio',
		                                         'xMinYMin meet',
		                                  )
		                                  .append( 'g' )
		                                  .attr( 'transform',
		                                         'translate(' + width / 2 + ',' +
				                                         height / 2 + ')',
		                                  );
		// Builds the pie chart. Each part of the pie is a path built using the arc function.
		graphVisual
				.selectAll()
				.data( pie( values ) )
				.enter()
				.append( 'path' )
				.classed( 'graph-column', true )
				.attr( 'd', d3.arc()
				              .innerRadius( radius - thickness )
				              .outerRadius( radius ),
				);
	} );
</script>

<style>
    .donut-graph {
        display: flex;
        justify-content: var(--chart--alignment, center);
        align-content: var(--chart--alignment, center);
        flex-direction: var(--chart--flex-direction, column);
        padding: var(--graph--spacing-unit);
    }
</style>

<figure bind:this={el} class="graph donut-graph">
    <div class="graph-title">{label}</div>
    <div class="graph-visual-wrapper">
        <svg class="graph-visual"/>
        <div class="data-label">{innerText}</div>
    </div>
</figure>