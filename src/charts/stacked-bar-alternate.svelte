<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let el;
	const padding = { top: 10, right: 0, bottom: 50, left: 50 };
	export let data = { data };
	export let width = { width };
	export let height = { height };
	export let xVar = { xVar };
	export let yVar = { yVar };
	export let yGroups = { yGroups };
	export let colorscheme = { colorscheme };
	export let orientation = 'vertical';
	export let hasAccent = false;
	export let label = { label };
	export let source = { source };
	export let credit = { credit };

	let classNames = [
		'graph',
		'stacked-bar-graph',
	];
	if ( hasAccent ) {
		classNames.push( 'has-accent' );
	}
	const getClassNames = () => {
		return classNames.join( ' ' );
	};
	// let stacked = d3.stack();
	$: xScale = d3.scaleBand()
	              .domain( data.map( function( o ) {
		              return o[ xVar ];
	              } ) )
			// .range([1, width - padding.left - padding.right])
			          .range( [ 1, width - padding.left - padding.right ] )
			          .padding( 0.1 );
	$: yScale = d3.scaleLinear()
	              .domain( [
		                       0, Math.max.apply( Math, data.map( function( o ) {
			              return o[ yVar ];
		              } ) ),
	                       ] )
			// .domain(yDomain)
			          .range( [ height - padding.bottom, 0 ] )
			          .nice();
	$: colors = d3.scaleOrdinal()
	              .domain( yGroups )
	              .range( colorscheme );

	console.log( 'yGroups', yGroups );

	onMount( () => {
		if ( orientation !== 'vertical' ) {
			xScale.range( [ padding.top, height - padding.bottom ] );
		}
		let chartGraph = d3.select( el );
		let chartContainer = chartGraph.select( '.chart__graph' )
		                               .attr( 'width', width )
		                               .attr( 'height', 250 );
		let chartWrapper = chartContainer.append( 'g' )
		                                 .attr( 'transform', function() {
			                                 if ( width < 600 ) {
				                                 return 'translate(' + 0 + ',' +
						                                 padding.top + ')';
			                                 }
			                                 else {
				                                 return 'translate(' + 0 + ',' +
						                                 padding.top + ')';
			                                 }
		                                 } );
		if ( orientation !== 'vertical' ) {
			for ( let i = 0; i < yGroups.length; i++ ) {
				chartWrapper.append( 'g' )
				            .selectAll( 'rect' )
				            .data( data )
				            .enter()
				            .append( 'rect' )
				            .attr( 'fill', colors( yGroups[ i ] ) )
				            .attr( 'y', function( d ) {
					            return xScale( d[ xVar ] );
				            } )
				            .attr( 'x', function( d ) {
					            let barheight = 0;
					            for ( let j = i; j > -1; j = j - 1 ) {
						            barheight += d[ yGroups[ j ] ];
					            }
					            return yScale( barheight );
				            } )
						// .attr("height", xScale.bandwidth())
						        .attr( 'height', 250 )
						        .attr( 'width', function( d ) {
							        return height - padding.bottom -
									        yScale( d[ yGroups[ i ] ] );
						        } );
			}
		}
		else {
			let xAxis = chartWrapper.append( 'g' )
			                        .attr( 'transform', 'translate(0,' +
					                        ( height - padding.bottom ) + ')' )
			                        .attr( 'class', 'horizontalAxis' )
			                        .call( d3.axisBottom( xScale )
			                                 .tickSizeInner( 0 )
			                                 .tickSizeOuter( 0 )
			                                 .tickPadding( 5 ),
			                        )
			                        .call( g => g.select( '.domain' ).remove() );
			xAxis.selectAll( 'path' )
			     .attr( 'stroke', '#ccc' );
			let yAxis = chartWrapper.append( 'g' )
			                        .attr( 'class', 'verticalAxis' )
			                        .call( d3.axisLeft( yScale )
			                                 .ticks( 5 )
			                                 .tickSizeInner( -width )
			                                 .tickSizeOuter( 0 )
			                                 .tickPadding( 3 ),
			                        )
			                        .call( g => g.select( '.domain' ).remove() );
			yAxis.selectAll( 'path' )
			     .attr( 'stroke', '#ccc' );

			// add data columns
			for ( let i = 0; i < yGroups.length; i++ ) {
				chartWrapper.append( 'g' )
                            .attr('class', 'variant')
				            .selectAll( 'rect' )
				            .data( data )
				            .enter()
				            .append( 'rect' )
				            .attr( 'fill', colors( yGroups[ i ] ) )
				            .attr( 'x', function( d ) {
					            return xScale( d[ xVar ] );
				            } )
				            .attr( 'y', function( d ) {
					            let barheight = 0;
					            for ( let j = i; j > -1; j = j - 1 ) {
						            barheight += d[ yGroups[ j ] ];
					            }

					            return yScale( barheight );
				            } )
				            .attr( 'width', xScale.bandwidth() )
				            .attr( 'height', function( d ) {
					            return height - padding.bottom -
							            yScale( d[ yGroups[ i ] ] );
				            } );
			}
		}
		////
	} );

</script>

<style>
    .chart :global() {
        position: relative;
    }

    .stacked-bar-graph :global(g.tick line) {
        stroke: #ccc;
    }

    .chart__graph {
        /* margin: 0 auto; */
        display: block;
    }

    .chart__label {
        display: none;
    }

    .chart__footer {
        display: none;
    }

    /* figure.graph{
        width: 60%;
    } */
</style>

<figure bind:this={el} class="{getClassNames()}">
    <div class="chart__label">{label}</div>

    <svg class="chart__graph"></svg>

    <div class="chart__footer">
        {#if source}

            <div class="charter__source">SOURCE: {@html source}</div>
        {/if}

        {#if credit}
            <div class="charter__source">Credit: {@html credit}</div>
        {/if}

    </div>
</figure>