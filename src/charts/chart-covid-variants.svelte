<script>
    import {onMount} from 'svelte';
    import {
        scaleBand,
        scaleLinear,
        scaleOrdinal,
        scaleQuantile,
        scaleQuantize,
        scaleThreshold
    } from 'd3-scale';
    import {axisBottom, axisLeft, axisRight, axisTop} from 'd3-axis';
    import {select} from 'd3-selection';
    import {legendColor, legendSize} from 'd3-svg-legend';
    import {vibrant} from '../helpers/colors.js'

    let d3 = {
        scaleLinear: scaleLinear,
        scaleBand: scaleBand,
        scaleOrdinal: scaleOrdinal,
        scaleQuantize: scaleQuantize,
        scaleQuantile: scaleQuantile,
        scaleThreshold: scaleThreshold,
        select: select,
        axisLeft: axisLeft,
        axisRight: axisRight,
        axisBottom: axisBottom,
        axisTop: axisTop,
        legendColor: legendColor,
        legendSize: legendSize
    }


    const padding = {top: 20, right: 0, bottom: 0, left: 20};


    export let data = [];
    export let width = {width};
    export let groups = {groups};
    export let columns = {columns};
    export let isPercentage = {isPercentage};
    export let colorscheme = vibrant;
    export let orientation = "horizontal";
    let cellBounds = [0]
    let totalItems = 0;
    let totalCells = 0;
    let cellValue = 1;
    let cells = [0];
    let numRows;
    let el;

    // Get total items which we need to know what value each cell represents.
    for (let i in groups) {
        totalItems = data[groups[i]] + totalItems;
    }

    totalCells = (isPercentage) ? 100 : totalItems;

    if (isPercentage) {
        cellValue = totalItems / 100;
    }

    // Determine how many cells each group fills.
    for (let i in groups) {
        console.log('Initial Group value', data[groups[i]]);
        let groupValue = Math.floor(data[groups[i]] / cellValue);
        console.log('groupValue', groupValue);
        cells.push(groupValue + cellBounds[cellBounds.length - 1]);
    }

    /**
     * If it's a percentage, use 100 cells. Otherwise, usa a 1:1 cell/data point
     */
    if (isPercentage) {
        numRows = Math.round(100 / columns)
    } else {
        numRows = Math.ceil(totalItems / columns)
    }

    let cellSize = Math.floor(width / columns) - 1;


    $: rows = numRows
    $: height = (rows * (cellSize + 1)) * 1.25
    $: xScale = d3.scaleLinear()
        .domain([0, totalItems])
        .range([0, columns * cellSize]);
    $: colorScale = d3.scaleQuantile()
        .domain(cellBounds)
        .range(colorscheme.splice(0, cellBounds.length - 1));

    onMount(generateWaffleChart);

    /**
     * Creates the graph
     */
    function generateWaffleChart() {
        let svg = d3.select(el)
            .append("svg")
            .attr("width", width)
            .attr("height", height + padding.top);

        let gviz = svg.append("g")
            .attr("transform",
                "translate(" + padding.left + "," + padding.top + ")")

        gviz.append("text")
            .style("fill", "var(--chart--label-color)")
            .style("font-size", "1.5rem")
            .style("font-weight", "700")
            .text(totalItems + " cases")


        for (let i = 0; i < totalCells; i++) {
            gviz.append("circle")
                .attr("aria-label", cellValue + ' cases')
                .attr("class", "rect" + i)
                .attr("cx", Math.floor(i / rows) * (cellSize + 1))
                .attr("cy", ((i % rows) * (cellSize + 1)) + 40)
                .attr("r", cellSize / 2)
                .attr("fill", colorScale(i))
                .attr("data-index", i)
        }


    }

    /**
     * Calculates the value each cell should represent.
     */
    function cellRepresents() {
        for (let g in groups) {
            totalItems = (isPercentage)
                ? data[groups[g]] + cellBounds[cellBounds.length - 1]
                : data[groups[g]] + cellBounds[cellBounds.length - 1];
            cellBounds.push(totalItems)
        }
    }
</script>

<style>
    .chart :global(text) {
        font-family: 'akkurat', sans-serif;
        font-size: 12px;
        text-transform: uppercase;
    }

    .chart :global(g.tick line) {
        stroke: #ccc;
    }

    .chart :global(.legendContainer) {
        display: block;
        margin: 0 auto;
        padding: 10px 0;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .chart :global(.legendContainer text) {
        font-family: 'akkurat', sans-serif;
        text-transform: uppercase;
        fill: #666;
        font-size: 11px;
    }

    .stats {
        display: grid;
        grid-template-columns: var(--proportions);
        margin: 0
    }

    .stats div {
        font-family: 'akkurat', sans-serif;
        font-size: 11px;
        text-transform: uppercase;
    }

    h3 {
        font-family: 'akkurat', sans-serif;
        font-size: 1.5rem;
        text-transform: unset;
        margin: 0 auto 1rem;
    }
</style>

<div bind:this={el} class="chart"></div>
