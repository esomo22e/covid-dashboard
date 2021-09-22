<script>
    import {onMount} from 'svelte';
    import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
    import {axisBottom, axisLeft, axisRight, axisTop} from 'd3-axis';
    import {select} from 'd3-selection';
    import {legendColor} from 'd3-svg-legend';

    let d3 = {
        scaleLinear,
        scaleBand,
        scaleOrdinal,
        select,
        axisLeft,
        axisRight,
        axisBottom,
        axisTop,
        legendColor: legendColor

    }

    let el;

    export let label = {label};
    export let value = {value};
    export let max = 100;
    export let width = 50;
    export let length = 100;
    export let orientation = 'horizontal';
    let plotLength = length;
    let plotWidth = width;

    let data = [max, value];

    $: widthScale = d3.scaleBand()
        .domain(data.map(function (o) {
            // return o[xVar];
        }))
        .rangeRound([0, plotWidth])
        .padding(0.2);

    $: lengthScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, plotLength])
        .nice();

    $: colorScale = d3.scaleOrdinal()
        .domain([0, 1])
        .range(['var(--chart--datapoint-color-container, gainsboro)', 'var(--chart--datapoint-color-primary, black)']);

    onMount(generateStackedColumn);

    function generateStackedColumn() {
        // draw chart SVG
        let svg = d3.select(el)
            .append("svg")
            .attr("class", "datapoint")
            .attr("width", plotLength)
            .attr("height", plotWidth);

        let columnContainer;

        /**
         * Create face and column
         */
        for (let i = 0; i < data.length; i++) {

            if (0 === i) {
                /**
                 * Adds the face to the datapoint.
                 * The column showing the value rests on this, like a watch face.
                 *
                 * @since 1.5
                 */
                svg.append("rect")
                    .attr("class", "datapoint__face")
                    .attr("height", widthScale.bandwidth())
                    .attr("width", function (d) {
                        return lengthScale(data[i]);
                    })
                    .attr("fill", function (d) {
                            return colorScale(i)
                        }
                    );
            } else {
                /**
                 * Adds the column containing the value.
                 * The column is kept in a container so the label can be
                 * centered inside of it.
                 *
                 * @since 1.5
                 */
                columnContainer = svg.append('g')
                    .attr("class", "datapoint__column-container");

                // TODO: Render column with path instead of rect for greater flexibility.
                // TODO: Ensure this can be animated.
                columnContainer.append("rect")
                    .attr("class", "datapoint__column")
                    .attr("height", widthScale.bandwidth())
                    .attr("width", function (d) {
                        return lengthScale(data[i]);
                    })
                    .attr("fill", function (d) {
                            return colorScale(i)
                        }
                    );

                /**
                 * Adds the datapoint label.
                 * This is placed in the column container so it can be centered
                 * inside the column, especially as it grows.
                 *
                 * @since 1.5
                 */
                // TODO: Solve visual exception where column may be too small for the label to be readable.
                if (0 < i) {
                    columnContainer.append('text')
                        .attr('x', function (d) {
                            return lengthScale(data[i]) / 2;
                        })
                        .attr('class', 'datapoint__label')
                        .text(`${data[i]}%`);
                }
            }
        }


    } // generateBarChart
</script>

<style>
    :global(.datapoint__label) {
        transform: translateY(30px);
        fill: var(--chart--datapoint-color-datapoint-label, white);
        mix-blend-mode: difference;
        font-size: 30px;
        text-anchor: middle;
        alignment-baseline: central;
    }

    :global(.datapoint__face) {
        fill: var(--chart--datapoint-color-face, gainsboro);
    }

    :global(.datapoint__column) {
        fill: var(--chart--datapoint-color-column, black);
    }
</style>

<div bind:this={el} class="chart"></div>
