<script>
    import {onMount} from 'svelte';
    import {scaleOrdinal} from 'd3-scale';
    import {mouse, select} from 'd3-selection';
    import {entries} from 'd3-collection';
    import {path} from 'd3-path';
    import {arc, pie} from 'd3-shape';

    // export let data = {data};
    export let value = {value};
    export let width = {width};
    export let height = {height};
    export let label = {label};
    // export let primaryKey = {primaryKey};
    // export let secondaryKey = {secondaryKey};
    export let hasAccent = false;
    export let isPercent = false;

    let classNames = [
        "graph",
        "donut-graph"
    ];

    if (hasAccent) {
        classNames.push("has-accent");
    }

    const getClassNames = () => {
        return classNames.join(" ");
    }


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
    let valueStyleParams = {};


    /**
     * Sets the text inside of the donut graph
     */
    let innerText;
    // TODO: Reenable this
    if (isPercent) {
        valueStyleParams = {style: 'percent', minimumFractionDigits: 2}
        innerText = (value[0] / 100).toLocaleString(undefined, valueStyleParams)
    } else {
        innerText = (value[0]).toLocaleString(undefined, valueStyleParams)
    }


    /**
     * Generate the graph
     */
    onMount(generateGraph);

    function generateGraph() {
        const graphContainer = d3.select(el);

        const graphTitle = graphContainer
            .append("div")
            .attr("class", "graph-title")
            .text(function (d) {
                return label
            })

        const graphVisualWrapper = graphContainer.append("div")
            .attr("class", "graph-visual-wrapper");

        /**
         * Add graph
         */
        // let graphData = {
        //     a: data[primaryKey],
        //     b: data[secondaryKey]
        // }

        const graphVisual = graphVisualWrapper
            .append("svg")
            .attr("class", "graph-visual")
            .attr("aria-label", `${innerText} ${label}`)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        /**
         * Adds the donut chart
         */
        const donut = d3.pie()
            .value(function (d) {
                return d.value;
            })
        let dataReady = donut(d3.entries(value))

        graphVisual
            .selectAll()
            .data(dataReady)
            // .data({a: value[0], b: value[1]})
            .enter()
            .append('path')
            .attr("class", "graph-column")
            .attr('d', d3.arc()
                .innerRadius(width * 0.35) // This is the size of the donut hole
                .outerRadius(width * 0.45)
            )

        /**
         * Adds the data label
         */
        graphVisual.append("text")
            .attr("class", "data-label")
            .text(innerText)
    }
</script>

<figure bind:this={el} class="{getClassNames()}"></figure>
