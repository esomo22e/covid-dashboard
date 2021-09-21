<script>
    import {onMount} from 'svelte';
    import {scaleLinear, scaleBand, scaleOrdinal} from 'd3-scale';
    import {axisLeft, axisRight, axisTop, axisBottom} from 'd3-axis';
    import {format} from 'd3-format';
    import {select} from 'd3-selection';
    import {vibrant} from '../helpers/colors.js'
    // import { wrapLabel } from '../helpers/wrapLabel.js'
    import {legendColor} from 'd3-svg-legend';

    let d3 = {
        scaleLinear: scaleLinear,
        scaleBand: scaleBand,
        scaleOrdinal: scaleOrdinal,
        select: select,
        axisLeft: axisLeft,
        axisRight: axisRight,
        axisBottom: axisBottom,
        axisTop: axisTop,
        format: format,
        legendColor: legendColor

    }

    let el;

    const padding = {top: 10, right: 0, bottom: 50, left: 10};


    export let label = {label};
    export let value = {value};
    export let max = 100;
    export let width = 50;
    export let length = 100;
    export let measureDomain = ([0, 100])
    export let orientation = 'horizontal';
    let colorscheme = vibrant;
    let plotLength = width;
    let plotWidth = width;

    let data = [max, value];

    $: xScale = d3.scaleBand()
        .domain(data.map(function (o) {
            // return o[xVar];
        }))
        .rangeRound([0, width - padding.left - padding.right])
        .padding(0.2);

    $: yScale = d3.scaleLinear()
        .domain(measureDomain)
        .range([length - padding.bottom, padding.top])
        .nice();

    $: colorScale = d3.scaleOrdinal()
        .domain(measureDomain)
        .range(colorscheme);

    onMount(generateStackedColumn);

    function generateStackedColumn() {
        if (orientation !== "vertical") {
            padding.top = 0;
            padding.left = 75;
            padding.right = 15;
            // if (xVar === "protest") {
            //     padding.left = 180
            // }
            xScale.rangeRound([padding.top, length - padding.bottom])
            yScale.range([0, width - padding.left - padding.right])
        }

        // draw chart SVG
        let svg = d3.select(el)
            .append("svg")
            .attr("width", plotLength)
            .attr("height", plotWidth)

        if ('horizontal' === orientation) {

            /**
             * Create bars with appropriate colors and widths.
             */
            svg.append('g');
            for (let i = 0; i < data.length; i++) {
                svg
                    .selectAll("rect")
                    .data(data)
                    .enter().append("rect")
                    .attr("fill", colorScale(i))
                    .attr("height", xScale.bandwidth())
                    .attr("width", function (d) {
                        return yScale(d);
                    });
            }

        }
        /* else {

            let axisBottom = svg.append("g")
                .attr("transform", "translate(0," + (length - padding.bottom) + ")")
                .call(d3.axisBottom(xScale).tickSize(0));

            svg.append("g")
                .call(d3.axisLeft(yScale)
                    // .ticks()
                    .tickSizeInner(-width)
                    .tickSizeOuter(0)
                    .tickPadding(3)
                )
                .call(g => g.select(".domain").remove());

            // add data columns
            for (let i = 0; i < value.length; i++) {
                svg.append('g')
                    .selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                    // .attr("x", function (d) {
                    //     return xScale(d[xVar]);
                    // })
                    .attr("fill", colorScale(value[i]))
                    .attr("y", function (d) {
                        let barheight = 0;
                        for (let j = i; j > -1; j = j - 1) {
                            barheight += d[value[j]]
                        }
                        return yScale(barheight)
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function (d) {
                        return length - padding.bottom - yScale(d[value[i]]);
                    })
                    .on("mouseover mousemove", function (event, d) {

                        d3.select(this)
                            .style("opacity", 0.8);

                        tooltip.select(".part1").html(d.time + "<br>" + value[i] + ":" + d[value[i]] + "%")
                        //
                        tooltip
                            .style("visibility", "unset")
                            // .style("left", xScale(d[xVar]) + "px")
                            .style("top", length - yScale(d[value[i]]) + "px")
                    }).on("mouseleave", function (d) {
                    tooltip
                        .style("visibility", "hidden")

                    d3.select(this)
                        .style("opacity", 1.0);
                })
            }
        }*/
    } // generateBarChart
</script>

<style>

</style>

<div bind:this={el} class="chart"></div>
