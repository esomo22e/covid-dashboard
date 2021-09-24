<script>
    import {onMount} from 'svelte';
    import {scaleOrdinal} from 'd3-scale';
    import {mouse, select} from 'd3-selection';
    import {entries} from 'd3-collection';
    import {path} from 'd3-path';
    import {arc, pie} from 'd3-shape';

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

    const padding = {top: 10, right: 40, bottom: 70, left: 50};

    // export let data = {data};
    export let width = {width};
    export let height = {height};
    export let value = {value};
    export let label = {label};
    let hasAccent = false;

    let classNames = [
        "graph",
        "data-point-graph"
    ];

    if (hasAccent) {
        classNames.push("has-accent");
    }

    const getClassNames = () => {
        return classNames.join(" ");
    }

    onMount(generateDonut);

    function generateDonut() {
        const graphContainer = d3.select(el);

        const graphTitle = graphContainer.append("div")
            .attr("class", "graph-title")
            .text(function (d) {
                return label
            })

        const svg = graphContainer
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })

        // Adds a rectangle behind the number
        let squareSideLength = 0.4 * width
        let squareStrokeWidth = "8px";
        svg.append("rect")
            .attr("class", "graph-column")
            .attr("width", squareSideLength)
            .attr("height", squareSideLength)
            .attr("x", -0.5 * squareSideLength)
            .attr("y", -0.5 * squareSideLength)
            .style("stroke-width", squareStrokeWidth)

        let textFontSizeAmount = 1.5;
        let textFontSizeUnit = "rem";
        let textOffsetY = 0.4 * textFontSizeAmount;

        svg.append("text")
            .attr("class", "data-label")
            .text((value).toLocaleString())
    }
</script>

<style>
    .chart {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: row;
    }

    .chart :global(.tipdate) {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0 auto 0.5rem;
    }

    .chart :global(.pcttooltip) {
        display: none;
        position: absolute;
        background-color: white;
        border: 2px solid black;
        border-radius: 10px;
        padding: 10px;
        width: 300px;
    }
</style>

<figure bind:this={el} class="{getClassNames()}"></figure>
