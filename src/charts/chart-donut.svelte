<script>
    import {onMount} from 'svelte';
    import {scaleOrdinal} from 'd3-scale';
    import {mouse, select} from 'd3-selection';
    import {entries} from 'd3-collection';
    import {path} from 'd3-path';
    import {arc, pie} from 'd3-shape';

    export let data = {data};
    export let width = {width};
    export let height = {height};
    export let label = {label};
    export let primaryKey = {primaryKey};
    export let secondaryKey = {secondaryKey};
    export let valueStyle = {valueStyle};
    let d3 = {
        scaleOrdinal: scaleOrdinal,
        entries: entries,
        pie: pie,
        arc: arc,
        select: select,
        mouse: mouse,
        path: path,
    }
    let el;
    let valueStyleParams;

    // TODO: Update this to allow for different data ranges
    data = data[data.length - 1] // only use latest day's data

    /**
     * Sets the text inside of the donut graph
     */
    let innerText;
    if ("percent" === valueStyle || 'object' === typeof valueStyle && "percent" === valueStyle.type) {
        valueStyleParams = {style: 'percent', minimumFractionDigits: 2}
        innerText = (data[primaryKey] / data[valueStyle.compareWith]).toLocaleString(undefined, valueStyleParams)
    } else {
        innerText = (data[primaryKey]).toLocaleString(undefined, valueStyleParams)
    }


    /**
     * Generate the graph
     */
    onMount(generateGraph);

    function generateGraph() {
        const graphContainer = d3.select(el);

        /**
         * Add title
         */
        graphContainer
            .append("div")
            .attr("class", "title")
            .text(function (d) {
                return label
            })

        /**
         * Add graph
         */
        let graphData = {
            a: data[primaryKey],
            b: data[secondaryKey]
        }

        let color = d3.scaleOrdinal()
            .domain(graphData)
            .range(["var(--chart--color-primary)", "var(--chart--color-secondary)"])

        const graphWrapper = graphContainer
            .append("div")
            .attr("class", "graph")

        const graph = graphWrapper
            .append("svg")
            .attr("aria-label", `${innerText} ${label}`)
            .attr("width", width)
            .attr("height", height)
            // .append("g")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        /**
         * Adds the pie chart
         */
        const pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
        let dataReady = pie(d3.entries(graphData))

        graph
            .selectAll()
            .data(dataReady)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(width * 0.35) // This is the size of the donut hole
                .outerRadius(width * 0.45)
            )
            .attr('fill', function (d) {
                return (color(d.data.key))
            })
            .attr('stroke-width', 0)

        graph.append("text")
            .attr("class", "key")
            .style("fill", "var(--chart--color-primary)")
            .attr("text-anchor", "middle")
            .text(innerText)
    }
</script>

<style>
    .chart {
        display: flex;
        justify-content: var(--chart--alignment, center);;
        align-content: var(--chart--alignment, center);
        flex-direction: var(--chart--flex-direction, column);
        margin: 0;
    }

    .chart :global(.title) {
        text-align: var(--chart--title-text-align);
        font-size: var(--chart--title-font-size);
        color: var(--chart--title-color);
        font-weight: var(--chart--title-weight);
        margin-bottom: 0;
    }

    .chart :global(.key) {
        text-align: var(--chart--key-text-align, var(--chart--title-text-align));
        font-size: var(--chart--key-font-size, var(--chart--title-font-size));
        color: var(--chart--key-color, var(--chart--title-color));
        font-weight: var(--chart--key-weight, var(--chart--title-weight));
        margin-bottom: 0;
        transform: translateY(0.25em);
    }

    .chart :global(.graph) {
        display: flex;
        justify-content: center;
    }

</style>

<figure bind:this={el} class="chart"></figure>
