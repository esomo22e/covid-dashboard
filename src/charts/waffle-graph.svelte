<script>
    import {onMount} from 'svelte';
    import * as d3 from 'd3';
    // import {
    //     scaleBand,
    //     scaleLinear,
    //     scaleOrdinal,
    //     scaleQuantile,
    //     scaleQuantize,
    //     scaleThreshold
    // } from 'd3-scale';
    // import {axisBottom, axisLeft, axisRight, axisTop} from 'd3-axis';
    // import {legendColor, legendSize} from 'd3-svg-legend';

    // let d3 = {
    //     scaleLinear: scaleLinear,
    //     scaleBand: scaleBand,
    //     scaleOrdinal: scaleOrdinal,
    //     scaleQuantize: scaleQuantize,
    //     scaleQuantile: scaleQuantile,
    //     scaleThreshold: scaleThreshold,
    //     axisLeft: axisLeft,
    //     axisRight: axisRight,
    //     axisBottom: axisBottom,
    //     axisTop: axisTop,
    //     legendColor: legendColor,
    //     legendSize: legendSize
    // }

    export let width = {width};
    export let value = {value};
    export let columns = {columns};
    export let isPercentage = {isPercentage};
    export let labels = {labels};
    export let footnotes = {footnotes}
    export let orientation = "horizontal";
    export let hasAccent = false;
    export let isResponsive = true;

    const padding = {top: 20, right: 0, bottom: 0, left: 20};
    let cellBounds = [0]
    let totalItems = 0;
    let totalCells = 0;
    let cellValue = 1;
    let cells = [0];
    let numRows;
    let el;

    let classNames = [
        "graph",
        "waffle-graph"
    ];

    if (hasAccent) {
        classNames.push("has-accent");
    }

    const getClassNames = () => {
        return classNames.join(" ");
    }

    for (let i in value) {
        totalItems = value[i] + totalItems;
        totalCells = totalItems;
    }

    if (isPercentage) {
        cellValue = totalItems / 100;
        totalCells = 100;
    }

    // Determine how many cells each group fills.
    for (let i in value) {
        let groupValue = value[i] / cellValue;
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


    let dataCategories = [];
    labels.forEach(element => dataCategories.push(slugify(element)));

    $: cellClassScale = d3
        .scaleQuantile()
        .domain(cells)
        .range(dataCategories.splice(0, cells.length - 1));

    onMount(generateWaffleChart);

    /**
     * Slugify a string.
     *
     * @see https://gist.github.com/codeguy/6684588#gistcomment-3243980
     *
     * @since 1.5
     */
    function slugify(text) {
        return text
            .toString()                     // Cast to string
            .toLowerCase()                  // Convert the string to lowercase letters
            .normalize('NFD')       // The normalize() method returns the Unicode Normalization Form of a given string.
            .trim()                         // Remove whitespace from both sides of a string
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    }

    /**
     * Creates the graph.
     *
     * @since 1.0
     */
    function generateWaffleChart() {
        const graphContainer = d3.select(el);

        // Add heading
        graphContainer.append("h3")
            .attr("class", "chart-label")
            .text(totalItems + " cases")
        const GRAPH_HEIGHT = height + padding.top + 20

        // Adds graph.
        let graph = graphContainer
            .append("svg")
            .style("max-width", `${width}px`)
            .attr("viewBox", `0 0 ${width} ${GRAPH_HEIGHT}`)

        if (isResponsive) {
            graph.style("width", "100%")
            graph.style("max-width", `${width}px`)
        } else {
            graph.attr("width", width)
                .attr("height", GRAPH_HEIGHT);
        }

        let group = graph.append("g")
            .attr("transform",
                "translate(" + padding.left + ",0)")


        for (let i = 0; i < totalCells; i++) {
            let cellLabel = (1 === cellValue) ?
                cellValue + " case"
                : cellValue + "cases";
            group.append("circle")
                .attr("aria-label", cellLabel)
                .attr("class", "graph-column graph-column-" + cellClassScale(i))
                .attr("cx", Math.floor(i / rows) * (cellSize + 1))
                .attr("cy", ((i % rows) * (cellSize + 1)) + 40)
                .attr("r", cellSize / 2)
                .attr("data-index", i)
        }

        // Adds legend.
        const legend = graphContainer
            .append("div")
            .attr("class", "legend");

        for (let i = 0; i < labels.length; i++) {
            let legendKey = legend
                .append("div")
                .attr("class", "legend-key graph-column-" + slugify(labels[i]));

            legendKey
                .append("span")
                .attr("class", "legend-key__identifier")
                .style("width", 0.75 * cellSize + "px")
                .style("height", 0.75 * cellSize + "px")

            legendKey
                .append("div")
                .attr("class", "legend-key__label")
                .text(function (d) {
                    return labels[i];
                })
        }

        // Adds footnotes
        if (0 < footnotes.length) {
            const graphFootnotes = graphContainer
                .append("div")
                .attr("class", "footnote-container");

            for (let i = 0; i < footnotes.length; i++) {
                let footnote = graphFootnotes
                    .append("p")
                    .attr("class", "footnote")
                    .text(function (d) {
                        return footnotes[i];
                    });
            }
        }

    }

</script>
<style>
    :global(.waffle-graph .chart-label) {
        margin: 0;
        text-align: left;
    }
    :global(.waffle-graph .legend-key__identifier) {
        border-radius: 50%;
    }
</style>

<figure bind:this={el} class="{getClassNames()}"></figure>
