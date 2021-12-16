<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let label = { label };
	export let value = { value };
	export let width = { width };
	export let length = { length };
	export let orientation = 'horizontal';
	export let max = 100;
	export let hasAccent = false;
	export let isResponsive = true;
	let el;
	let data = [ max, value ];
	let classNames = [
		'graph',
		'meter-graph',
	];
	if ( hasAccent ) {
		classNames.push( 'has-accent' );
	}

	function getClassNames () {
		return classNames.join( ' ' );
	}

	if ( 'horizontal' !== orientation ) {
		orientation = 'vertical';
	}
	$: widthScale = d3.scaleBand()
	                  .rangeRound( [ 0, width ] );
	$: lengthScale = d3.scaleLinear()
	                   .domain( [ 0, 100 ] )
	                   .range( [ 0, length ] )
	                   .nice();
	onMount( generateChart );

	function generateChart () {
		let classNames = [ 'datapoint' ];
		let chartWidth;
		let chartHeight;
		let datapointWidthAttr;
		let datapointLengthAttr;
		/**
		 * Set variables to match orientation.
		 *
		 * @since 1.5
		 */
		if ( 'vertical' === orientation ) {
			classNames.push( 'is-vertical' );
			chartHeight = length;
			chartWidth = width;
			datapointWidthAttr = 'width';
			datapointLengthAttr = 'height';
		}
		else {
			classNames.push( 'is-horizontal' );
			chartHeight = width;
			chartWidth = length;
			datapointWidthAttr = 'height';
			datapointLengthAttr = 'width';
		}
		const figure = d3.select( el );
		const chartLabel = figure
				.append( 'figcaption' )
				.attr( 'class', 'graph-title' );
		chartLabel.text( function ( d ) {
			return label;
		} );
		const svg = figure
				.append( 'svg' )
				.attr( 'class', classNames.join( ' ' ) )
				.attr( 'viewBox', `0 0 ${ chartWidth } ${ chartHeight }` );
		if ( isResponsive ) {
			svg.style( 'width', '100%' );
			svg.style( 'max-width', `${ chartWidth }px` );
		}
		else {
			svg.attr( 'width', chartWidth )
			   .attr( 'height', chartHeight );
		}
		/**
		 * Create chart
		 *
		 * @since 1.0
		 */
		for ( let i = 0; i < data.length; i++ ) {
			if ( 0 === i ) {
				/**
				 * Adds the face to the datapoint.
				 * The column showing the value rests on this, like a watch face.
				 *
				 * @since 1.5
				 */
				svg.append( 'rect' )
				   .attr( 'class', 'graph-face' )
				   .attr( datapointWidthAttr, widthScale.bandwidth() )
				   .attr( datapointLengthAttr, function ( d ) {
					   return lengthScale( data[ i ] );
				   } );
			}
			else {
				/**
				 * Adds the column containing the value.
				 * The column is kept in a container so the label can be
				 * centered inside of it.
				 *
				 * @since 1.5
				 */
				let columnContainer = svg.append( 'g' )
				                         .attr( 'class',
				                                'datapoint__column-container',
				                         );
				let columnVerticalOffset = 0;
				let columnLength = Math.floor(
						lengthScale( ( 100 > data[ i ] ) ? data[ i ] : 100 ) );
				let columnWidth = Math.floor( widthScale.bandwidth() );
				let columnMidWidth = Math.floor( widthScale.bandwidth() / 2 );
				let columnMidLength = Math.floor( columnLength / 2 );
				let column = columnContainer.append( 'rect' )
				                            .attr( 'class', 'graph-column' )
				                            .attr( datapointWidthAttr, columnWidth )
				                            .attr( datapointLengthAttr, columnLength );
				if ( 'vertical' === orientation ) {
					columnVerticalOffset = Math.floor( chartHeight - columnLength );
					columnContainer.attr( 'transform',
					                      'translate(0, ' + columnVerticalOffset + ')',
					);
				}
				/**
				 * Adds the datapoint label.
				 * This is placed in the column container so it can be centered
				 * inside the column, especially as it grows.
				 *
				 * @since 1.5
				 */
				let datapointLabel = columnContainer.append( 'text' )
				                                    .attr( 'class', 'data-label' )
				                                    .text( `${ data[ i ] }%` );
				if ( 'vertical' === orientation ) {
					let labelVerticalOffset = ( 20 > data[ i ] ) ?
							columnMidLength :
							columnMidLength;
					datapointLabel.attr( 'x', function ( d ) {
						              return columnMidWidth;
					              } )
					              .attr( 'y', function ( d ) {
						              return labelVerticalOffset;
					              } );
				}
				else if ( 'horizontal' === orientation ) {
					datapointLabel.attr( 'x', function ( d ) {
						return columnMidLength;
					} ).attr( 'y', function ( d ) {
						return '50%';
					} );
				}
			}
		}
	}
</script>
<style>
</style>

<figure bind:this={el} class="{getClassNames()}"></figure>