<script>
    import {onMount} from 'svelte';
    import * as d3 from 'd3';

    export let data = {data};
    export let width = {width};
    export let height = {height};
    export let category = {category};
    export let value = {value};
    export let groups = {groups};
    export let groupLabels = {groupLabels};
    export let plotMargin = {top: 5, right: 0, bottom: 60, left: 42}
    export let hasAccent = false;
    export let columnDescription = {columnDescription};

    let el;
    let tooltipOffsetX = 15;
    let tooltipOffsetY = 70;


    let len = data.length;

    let classNames = [
        "graph",
        "bar-graph"
    ];

    if (hasAccent) {
        classNames.push("has-accent");
    }

    const getClassNames = () => {
        return classNames.join(" ");
    }

    $: xScale = d3.scaleBand()
        .domain(data.map(function (o) {
            return o[category];
        }))
        .range([1, width - 2 * plotMargin.left])
        .padding(0.1);

    $: yScale = d3.scaleLinear()
        .domain([0, Math.max.apply(Math, data.map(function (o) {
            return o[value];
        }))])
        .range([height - plotMargin.bottom, plotMargin.top])
        .nice();

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
            .replace(/\-\-+/g, '-')        // Replace multiple - with single -
            .replace(/_+/g, '-');        // Replace underscore _ with dash -
    }

    function showTip(d, target, mouse) {

        let innerHTML = `<div class="tooltip__date">${new Date(d[category]).toLocaleDateString()}</div>`;

        for (let i = 0; i < groups.length; i++) {
            innerHTML += '<div class="tooltip__result">' + groupLabels[i] + ": " + d[groups[i]] + "</div>";
        }

        target
            .style("position", "absolute")
            .style("display", "inline-block")
            .style("left", (mouse[0] - tooltipOffsetX) + "px")
            .style("top", (mouse[1] - tooltipOffsetY) + "px")
            .html( innerHTML );
    }

    /**
     * Gets the text description of the column for ARIA, etc.
     * Adapted from Stack Overflow's formatUnicorn().
     *
     * @see https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format#answer-18234317
     *
     * @since 1.5
     */
    function getColumnTextDescription(d) {
        let str = columnDescription;
        if (arguments.length) {
            let t = typeof arguments[0];
            let key;
            let args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    }

    onMount(generateColumnChart);

    function generateColumnChart() {
        let graphContainer = d3.select(el);

        let tooltip = graphContainer.append("div").attr("class", "tooltip");

        /**
         * Adds legend.
         *
         * @since 1.5
         */
        let legend = graphContainer
            .append("div")
            .attr("class", "legend");

        for (let i = 0; i < groups.length; i++) {
            let legendKey = legend
                .append("div")
                .attr("class", "legend-key graph-column-" + slugify(groupLabels[i]));

            legendKey
                .append("span")
                .attr("class", "legend-key__identifier")

            legendKey
                .append("div")
                .attr("class", "legend-key__label")
                .attr("aria-label", "Identifier for " + groupLabels[i])
                .text(function (d) {
                    return groupLabels[i];
                })
        }

        /**
         * Adds graph.
         *
         * @since 1.0
         */

        let graph = d3.select(el)
            .append("svg")
            .attr("class", "graph-visual")
            .attr("width", width)
            .attr("height", height);

        let plotWrapper = graph.append("g")
            .attr("transform",
                "translate(" + plotMargin.left + "," + 0 + ")");

        /**
         * Adds axis bars and ticks to plot.
         *
         * @since 1.0
         */

        let xAxis = plotWrapper.append("g")
            .attr("class", "graph-plot")
            .attr("transform", "translate(0," + (height - plotMargin.bottom) + ")")
            .attr("class", "axis axis--x")



        let xAxisTicks = xAxis.append("g")
            .attr("class", "axis-ticks")
            .call(
            d3.axisBottom(xScale)
                .tickValues(xScale.domain())
                .tickSize(0)
        );

        let xAxisLine = xAxis.selectAll("path")
            .attr("class", "axis-line axis-line--x");

        let xAxisLabel = xAxis.selectAll("text")
            .attr("class", "axis-label  axis-label--x")
            .attr("dx", -3)
            .attr("dy", 3.5)


        let yAxis = plotWrapper.append("g")
            .attr("class", "axis axis--y")
            .call(
                d3.axisLeft(yScale)
                    .ticks(
                        Math.min(6, yScale.domain()[1])
                    )
                    .tickSize(0)
            );

        let yAxisLine = yAxis.selectAll("path")
            .attr("class", "axis-line axis-line--y");

        let yAxisLabel = yAxis.selectAll("text")
            .attr("class", "axis-label axis-label--y")

        /**
         * Adds columns to visual.
         *
         * @since 1.0
         */
        for (let i = 0; i < groups.length; i++) {
            plotWrapper.append('g')
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "graph-column graph-column-" + slugify(groups[i]))
                .attr("aria-label", function (d) {
                    return getColumnTextDescription(d);
                })
                .attr("x", function (d) {
                    return xScale(d[category]);
                })
                .attr("y", function (d) {
                    let columnHeight = 0;
                    for (let j = i; j > -1; j = j - 1) {
                        columnHeight += d[groups[j]]
                    }
                    return yScale(columnHeight)
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return height - plotMargin.bottom - yScale(d[groups[i]]);
                })
                .on("mousemove", function (event, d) {
                    if (window.innerWidth > 600) {
                        showTip(d, tooltip, d3.pointer(event))
                    }
                })
                .on("mouseout", function (d) {
                    tooltip.style("display", "none")
                });
        }


    }
</script>

<style>
    :global(.tooltip__date) {
        font-weight: var(--global--font-weight-bold);
        margin-bottom: calc(0.25 * var(--global--spacing-unit));
    }
</style>

<figure bind:this={el} class="{getClassNames()}"></figure>
