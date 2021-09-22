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


    export let data = [];
    export let width = {width};
    export let groups = {groups};
    export let columns = {columns};
    export let isPercentage = {isPercentage};
    export let colors = {colors};
    export let labels = {labels};
    export let footnotes = {footnotes}
    export let orientation = "horizontal";

    const padding = {top: 20, right: 0, bottom: 0, left: 20};
    let cellColors = colors.map((x) => x);
    let cellBounds = [0]
    let totalItems = 0;
    let totalCells = 0;
    let cellValue = 1;
    let cells = [0];
    let numRows;
    let el;

    for (let i in groups) {
        totalItems = data[groups[i]] + totalItems;
        totalCells = totalItems;
    }

    if (isPercentage) {
        cellValue = totalItems / 100;
        totalCells = 100;
    }

    // Determine how many cells each group fills.
    for (let i in groups) {
        let groupValue = data[groups[i]] / cellValue;
        let subtotal = Math.round(groupValue) + cells[cells.length - 1];

        if (isPercentage && 100 < subtotal) {
            subtotal = 100;
        }

        cells.push(subtotal);
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
    $: colorScale = d3
        .scaleQuantile()
        .domain(cells)
        .range(cellColors.splice(0, cells.length - 1));

    onMount(generateWaffleChart);

    /**
     * Creates the graph.
     *
     * @since 1.0
     */
    function generateWaffleChart() {
        const graphContainer = d3.select(el);

        // Adds graph.
        let graph = graphContainer
            .append("svg")
            .attr("width", width)
            .attr("height", height + padding.top + 20);

        let group = graph.append("g")
            .attr("transform",
                "translate(" + padding.left + "," + padding.top + ")")

        group.append("text")
            .attr("class", "chart-label")
            .text(totalItems + " cases")


        for (let i = 0; i < totalCells; i++) {
            group.append("circle")
                .attr("aria-label", cellValue + ' cases')
                .attr("class", "rect" + i)
                .attr("cx", Math.floor(i / rows) * (cellSize + 1))
                .attr("cy", ((i % rows) * (cellSize + 1)) + 40)
                .attr("r", cellSize / 2)
                .attr("fill", colorScale(i))
                .attr("data-index", i)
        }

        // Adds legend.
        const graphLegend = graphContainer
            .append("div")
            .attr("class", "legend");

        for (let i = 0; i < labels.length; i++) {
            let legendCell = graphLegend
                .append("div")
                .attr("class", "legend-key");

            legendCell
                .append("span")
                .attr("class", "legend-key-indicator")
                .style("background-color", colors[i])
                .style("width",  0.75 * cellSize + "px")
                .style("height",  0.75 * cellSize + "px")

            legendCell
                .append("div")
                .attr("class", "legend-key-label")
                .text(function (d) {
                    return labels[i];
                })
        }

        // Adds footnotes
        if (0 < footnotes.length) {
            const graphFootnotes = graphContainer
                .append("div")
                .attr("class", "footnotes");

            for (let i = 0; i < footnotes.length; i++) {
                let footnote = graphFootnotes
                    .append("div")
                    .attr("class", "footnote")
                    .append("small")
                    .attr("class", "footnote-body")
                    .text(function (d) {
                        return footnotes[i];
                    });
            }
        }

    }

</script>

<style>

    .chart :global(.legend) {
        display: flex;
        justify-content: space-around;
    }

    .chart :global(.legend-key) {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 50px 0 0;
    }

    .chart :global(.legend-key-indicator) {
        border-radius: 50%;
        display: block;
    }

    .chart :global(.legend-key-label) {
        color: var(--chart--key-color);
        font-family: var(--chart--key-font);
        font-size: var(--chart--key-font-size);
        padding: 10px 0;
        text-align: center;
        text-transform: uppercase;
    }

    .chart :global(.footnotes) {
        margin-top: var(--chart--footnote-margin);
        color: var(--chart--footnote-color);
        font-family: var(--chart--footnote-font);
        font-size: var(--chart--footnote-font-size);
        font-weight: var(--chart--footnote-weight);
        line-height: var(--chart--footnote-line-height);
        text-align: left
    }


    .chart :global(text) {
        font-family: var(--chart--title-font);
        font-size: var(--chart--title-font-size);
        text-transform: uppercase;
    }

    .chart :global(.chart-label) {
        text-align: var(--chart--title-text-align);
        font-size: var(--chart--title-font-size);
        color: var(--chart--title-color);
        font-weight: var(--chart--title-weight);
        margin-bottom: 0;
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
