<script>
    import GraphicTitle from './components/GraphicTitle.svelte'
    import GraphicFooter from './components/GraphicFooter.svelte'
    import Chart_Donut from './charts/chart-donut.svelte';
    import Meter_Chart from './charts/meter-chart.svelte';
    import Chart_Bar_Vertical from './charts/chart-bar-vertical.svelte'
    import Chart_Wellness_Summary from './charts/wellness-summary.svelte'
    import Chart_Hospitalizations
        from './charts/chart-hospitalizations-current.svelte'
    import SvelteTable from "svelte-table"
    import Chart_Covid_Variants from "./charts/chart-covid-variants.svelte";
    import {csv} from 'd3-fetch'
    import {timeFormat, timeParse} from 'd3-time-format';
    import {negativePositive} from './helpers/colors.js'
    import Datepicker from 'svelte-calendar';

    const meterColumnWidth = 66;
    const meterColumnLength = 406;

    /**
     * Gets a date object for today.
     *
     * @since 2.0
     *
     * @return Date
     */
    function getToday() {
        return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    }

    /**
     * Gets a date object for a specified number of days ago.
     *
     * @since 2.0
     *
     * @return Date
     */
    function getDaysAgo(daysAgo) {
        return new Date(getToday() - daysAgo * 24 * 60 * 60 * 1000);
    }

    /**
     * Gets a date object for the start of the semester
     *
     * @since 2.0
     *
     * @return Date
     */
    function getSemesterStart() {
        return new Date(filterEndDate - 7 * 24 * 60 * 60 * 1000);
    }

    /**
     * Sets a single filter button as active.
     */
    function setActiveFilter(selector) {
        let filterButtons = document.querySelectorAll('.button-filter');
        let activeButton = document.querySelector(selector);
        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove('is-active');
        })

        activeButton.classList.add('is-active');
    }

    /**
     * Sets filter dates to past seven days
     */
    function setFilterLastSevenDays() {
        filterStartDate = getDaysAgo(7);
        filterEndDate = getToday();
        setActiveFilter('.filter-seven-days');
    }


    /**
     * Sets filter dates to past thirty days
     */
    function setFilterLastThirtyDays() {
        filterStartDate = getDaysAgo(30);
        filterEndDate = getToday();
        setActiveFilter('.filter-thirty-days');
    }

    /**
     * Sets filter dates to past thirty days
     */
    function setFilterThisSemester() {
        filterStartDate = new Date("2021/09/02");
        filterEndDate = new Date("2021/12/08");
        setActiveFilter('.filter-semester');
    }


    /**
     * Set up default dates
     *
     * @since 2.0
     */
    let filterEndDate = getToday();
    let filterStartDate = getDaysAgo(7);
    let isStartDateChosen = false;
    let isEndDateChosen = false;

    /**
     * Get COVID dataset
     *
     * @since 1.0
     */

    // const url = 'https://spreadsheets.google.com/feeds/cells/1REJNqVcREni8IlxiObIbm5M6xU0lb8BeKfxJO0lNvXk/1/public/full?alt=json&date=' + dateCode

    // the dollar sign is a Svelte-y way of declaring a variable that will be dynamic
    $: covidData = [];


    const parseTime = timeParse("%m/%d/%y");
    const formatDate = timeFormat("%m/%d/%y");

    const DEV_BASE_DIR = "//news.northeastern.edu/interactive/2021/08/updated-covid-dashboard";
    const LOCAL_BASE_DIR = "";
    let baseDir;

    baseDir = DEV_BASE_DIR;
    if ("localhost" === window.location.hostname) {
        baseDir = LOCAL_BASE_DIR;
    }
    csv(baseDir + "/datasets/covidupdate_testData.csv").then(function (data, i) {
        data.forEach(function (d, i) {
            Object.keys(d).forEach(function (j) {
                if ((j === "Date") || (j === "Mass. Positive Rate")) {
                    d[j] = d[j]
                } else {
                    d[j] = parseFloat(d[j])
                }

            })
        });

        covidData = data;
    });

    /**
     * Filters test results by date.
     *
     * @since 2.0
     */
    $: filteredData = covidData.filter(function (d) {
        const START_DATE = new Date(filterStartDate).getTime();
        const END_DATE = new Date(filterEndDate).getTime();
        const COMPARE_DATE = new Date(d.Date).getTime();
        return (COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE);
    });

    // NEED THESE TO CYCLE THROUGH THE HEADERS OF THE GOOGLE SHEET

    // Dynamically figure out the width of CSS grid items.
    let width = document.getElementById('covid-testing-dashboard').getBoundingClientRect().width;
    let width_donut = Math.min(width, 175);
    let width_stacked = 20;
    let height = 500;
    // height = Math.min(height, 500);

    if (window.innerWidth > 600) {
        width_donut = width * 0.22;
        width_stacked = (width * 0.5)
        height = width * 0.6;
    }


    // These are the columns for the table portion; this configuration is passed to the SvelteTable plugin
    const columns = [
        {
            key: "Date",
            title: "Date",
            value: v => new Date(v["Date"]),
            renderValue: v => v["Date"],
            sortable: true,
            headerClass: "text-left",
            class: "date-col"
        },
        {
            key: "Tests Completed",
            title: "Tests Completed",
            value: v => v["Tests Completed"],
            sortable: true,
            headerClass: "text-left"
        },
        {
            key: "Negative Tests",
            title: "Negative Tests",
            value: v => v["Negative Tests"],
            sortable: true,
            headerClass: "text-left"
        },
        {
            key: "Negative Rate",
            title: "Negative Rate",
            value: v => (
                (v["Negative Tests"] / v["Tests Completed"]).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 2
                })
            ),
            sortable: true,
            headerClass: "text-left"
        },
        {
            key: "Positive Tests",
            title: "Positive Tests",
            value: v => v["Positive Tests"],
            sortable: true,
            headerClass: "text-left"
        },
        {
            key: "Positive Rate",
            title: "Positive Rate",
            value: v => (
                (v["Positive Tests"] / v["Tests Completed"]).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 2
                })
            ),
            sortable: true,
            headerClass: "text-left"
        }
    ];

    /**
     * Gets the data for the most recent day
     */

    function getMostRecentEntry(prop) {
        return covidData[covidData.length - 1][prop];
    }

    /**
     * Toggles view of table
     *
     * @since 2.0
     */
    let initialTableHeight;
    let fullTableHeight;

    function toggleTable() {
        const tableWrapper = document.querySelector('.dash-table-wrapper');
        const buttonToggleLabel = document.querySelector('.table-button .button-label');
        const buttonToggleLabelInitial = 'Expand Table';
        const buttonToggleLabelExpanded = 'Collapse Table';

        if (!initialTableHeight) {
            initialTableHeight = tableWrapper.offsetHeight;
            tableWrapper.style.height = 'auto';
            fullTableHeight = tableWrapper.offsetHeight;
            tableWrapper.style.height = initialTableHeight + 'px';
        }

        if (tableWrapper.classList.contains('is-expanded')) {
            tableWrapper.classList.remove('is-expanded');
            tableWrapper.style.height = initialTableHeight + 'px';
            buttonToggleLabel.innerText = buttonToggleLabelInitial;
        } else {
            tableWrapper.classList.add('is-expanded');
            tableWrapper.style.height = fullTableHeight + 'px';
            buttonToggleLabel.innerText = buttonToggleLabelExpanded;
        }
    }

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }


</script>

<style>
    :root {
        /**
         * Global font jobs.
         * Fonts should be set them to the job the text is doing. Avoid assigning
         * specific font faces on elements to keep future updates simple.
         *
         * Body. Versatile and facilitates reading even long-form content comfortably.
         *
         * Display. To attract attention and set the tone. Good for top-level headings
         * and hero text.
         *
         * Lettering. Artistic font for displaying an individual letter with flair.
         *
         * Signage. To help people find their way around. Use for labels in a grid of
         * products, buttons, strong calls to action, and footers full of links.
         *
         * Small. For clarity at small sizes. Captions, labels, footnotes, or where
         * there is limited screen real estate.
         *
         * Tabular. Quickly scannable to gather data and make comparisons. Ideal for
         * tables of contents, charts, or anywhere data needs to be easily understood.
         *
         * Technical. For technical accuracy where glyph placement is crucial. Use
         * when displaying math formulas, code, or even poetry and infographics.
         *
         * @since 1.5
         */
        --global--font-body: harriet, serif;
        --global--font-display: akkurat, sans-serif;
        --global--font-display-impact: trim-poster, sans-serif;
        --global--font-signage: brauerneue, sans-serif;
        --global--font-small: akkurat, sans-serif;
        --global--font-tabular: akkurat, sans-serif;
        --global--font-technical: akkurat, sans-serif;
        --global--font-lettering: 'Pinyon Script', cursive;

        /**
         * Global font sizes.
         * Specified in t-shirt sizing.
         *
         * @since 1.5
         */
        --global--font-size-xxs: 12px; /* 12px */
        --global--font-size-xs: 0.875rem; /* ~14px */
        --global--font-size-s: 1rem; /* ~16px */
        --global--font-size-m: 1.188rem; /* ~19px */
        --global--font-size-l: 1.5rem; /* ~24px */
        --global--font-size-xl: 1.875rem; /* ~30px */
        --global--font-size-xxl: 2.25rem; /* ~36px */
        --global--font-size-3xl: 2.5rem; /* 40px */
        --global--font-size-4xl: 3rem; /* 48px */
        --global--font-size-5xl: 4.063rem; /* ~65px */
        --global--font-size-6xl: 4.5rem; /* ~72px */

        /* Line Height */
        --global--line-height-body: 1.4;

        /* Content bounds */
        --global--ceiling-text: 700px;
        --global--ceiling-image: 750px;
        --global--ceiling-content: 1150px;

        /**
         * Global font weights.
         *
         * @since 1.5
         */
        --global--font-weight-thin: 100;
        --global--font-weight-extra-light: 200;
        --global--font-weight-light: 300;
        --global--font-weight-regular: 400;
        --global--font-weight-medium: 500;
        --global--font-weight-semi-bold: 600;
        --global--font-weight-bold: 700;
        --global--font-weight-extra-bold: 800;
        --global--font-weight-black: 900;
        --global--font-weight-ultra-black: 950;

        /**
         * Colors.
         * The names for hues are those found on a basic RYB color wheel with tertiary
         * colors.
         *
         * @see https://en.wikipedia.org/wiki/Tertiary_color#Traditional_painting_(RYB)
         *
         * Red, Red-Orange, Orange, Yellow-Orange, Yellow, Yellow-Green, Green,
         * Blue-Green, Blue, Blue-Violet, Violet, and Red-Violet
         *
         * Accessibility:
         * White text will pass on colors with a "dark-" prefix.
         * Black text will pass on colors with a "light-" prefix.
         *
         * Neutral colors:
         * Neutral colors that are not true neutral have either a "warm" or "cool"
         * prefix, as appropriate.
         */
        --global--color-darkest-red: #1f0406;
        --global--color-dark-red: #7a0f19;
        --global--color-red: #D41B2C;
        --global--color-darker-blue: #1b3645;
        --global--color-dark-blue: #385775;
        --global--color-blue: #006EB5;
        --global--color-light-blue: #9ebcda;
        --global--color-lighter-blue: #f7fcfd;
        --global--color-accent-blue: #52CFE5;
        --global--color-blue-green: #00CFB5;
        --global--color-violet: #6e016b;

        --global--color-black: #000;
        --global--color-white: #fff;
        --global--color-dark-gray: #222;
        --global--color-gray: #555;
        --global--color-light-gray: #99a3b0;
        --global--color-lighter-gray: #cbcccb;
        --global--color-lightest-gray: #efefef;

        --global--color-primary: var(--global--color-black);
        --global--color-background: var(--global--color-white);
        --global--color-secondary: var(--global--color-red);
        --global--color-disabled: var(--global--color-lighter-gray);
        --global--color-disabled-background: var(--global--color-lightest-gray);

        /**
         * Global Spacing.
         */
        --global--spacing-unit: 16px;
        --global--spacing-vertical: calc(5 * var(--global--spacing-unit));
        --global--spacing-horizontal: calc(2.5 * var(--global--spacing-unit));
        --global--spacing-gap: 20px;

        --global--spacing-extra-small: calc(0.6 * var(--global--spacing-unit));
        --global--spacing-small: calc(0.8 * var(--global--spacing-unit));
        --global--spacing-medium: var(--global--spacing-unit);
        --global--spacing-large: calc(1.5 * var(--global--spacing-unit));
        --global--spacing-extra-large: calc(1.75 * var(--global--spacing-unit)) /**
   * Global Borders
   */
        --global--border-color-light: var(--global--color-lightest-gray);
        --global--border-color-regular: var(--global--color-lighter-gray);
        --global--border-color-heavy: var(--global--color-gray);
        --global--border-weight-regular: 1px;
        --global--border-weight-bold: 2px;
        --global--border-radius-tight: 10px;
        --global--border-radius-regular: 12px;
        --global--border-radius-loose: 16px;
        /**
         * BEGINNING OF OTHER STYLES
         *
         */

        /**
         * Global font sizes.
         */

        /**
         * Global brand color palette.
         */
        --global--color-brand-dark-blue: #385775;
        --global--color-brand-white: #fff;

        /**
         * Global color palette.
         */

        --global--color-darkest-blue: #1b3645;
        --global--color-teal: #00cfb5;
        --global--color-purple: #6e016b;

        /**
         * Buttons
         */
        --button--primary--base-background: var(--global--color-purple);
        --button--primary--base-color: var(--global--color-brand-white);

        --button--secondary--base-background: var(--global--color-dark-blue);
        --button--secondary--base-color: var(--global--color-brand-white);
        --button--secondary--border-color: var(--global--color-darkest-blue);

        /**
         * Charts
         */
        --graph--color-primary: var(--global--color-purple);
        --graph--color-secondary: var(--global--color-light-blue);
        --graph--color-accent-1: #bfd3e6;
        --graph--color-accent-2: #8c96c6;
        --graph--color-accent-3: #6e016b;

        --chart--title-font: var(--global--font-signage, inherit);
        --chart--title-font-size: var(--global--font-size-l);
        --chart--title-weight: var(--global--font-weight-bold);
        --chart--title-color: var(--global--color-black);

        --graph-title--font-size: var(--global--font-size-l);
        --graph-title--font-weight: var(--global--font-weight-bold);
        --graph-title--color: var(--global--color-black);
        --chart--label-font: var(--global--font-signage, inherit);
        --chart--label-text-align: center;

        --chart--key-font: var(--global--font-signage, inherit);
        --chart--key-font-size: var(--global--font-size-s);
        --chart--key-text-align: center;
        --chart--key-weight: var(--global--font-weight-bold);
        --chart--key-color: var(--global--color-black);
        --chart--alignment: center;
        --chart--flex-direction: column;


        --chart--variants-base: var(--graph--color-accent-1);
        --chart--variants-alpha: var(--graph--color-accent-2);
        --chart--variants-delta: var(--graph--color-accent-3);

        --chart--footnote-font: var(--global--font-signage, inherit);
        --chart--footnote-font-size: var(--global--font-size-xs);
        --chart--footnote-weight: var(--global--font-weight-light);
        --chart--footnote-color: var(--global--color-black);
        --chart--footnote-line-height: 1.4;
        --chart--footnote-margin: var(--global--spacing-unit);

        --graph--spacing-unit: var(--global--spacing-unit);

        --graph--color-face: var(--global--color-light-blue);

        --data-label--color: var(--global--color-white);
        --data-label--font-size: var(--global--font-size-xl);
        --data-label--font-weight: var(--global--font-weight-bold);

        --data-category--color: var(--global--color-black);
        --data-category--font-size: var(--global--font-size-xxs);
        --data-category--font-weight: var(--global--font-weight-regular);

    }

    /**
     * Base graph elements
     */
    :global(.graph) {
        margin: 0;
    }

    :global(.graph.has-accent) {
        --chart--title-color: var(--global--color-purple);
        --chart--title-font-size: var(--global--font-size-m);
        --data-label--color: var(--global--color-black);
        --data-label--font-size: var(--global--font-size-m);
    }

    :global(.graph-title) {
        display: block;
        color: var(--graph-title--color);
        font-size: var(--graph-title--font-size);
        font-weight: var(--graph-title--font-weight);
        margin-bottom: var(--graph--spacing-unit, 1rem);
    }

    :global(.graph-face) {
        fill: var(--graph--color-face);
    }

    :global(.graph-column:nth-child(n+1)) {
        fill: var(--graph--color-primary);
    }
    :global(.graph-column:nth-child(n+2)) {
        fill: var(--graph--color-secondary);
    }
    :global(.graph-column:nth-child(n+3)) {
        fill: var(--graph--color-accent-1);
    }
    :global(.graph-column:nth-child(n+4)) {
        fill: var(--graph--color-accent-2);
    }
    :global(.graph-column:nth-child(n+5)) {
        fill: var(--graph--color-accent-3);
    }

    :global(.data-label) {
        fill: var(--data-label--color, white);
        text-anchor: middle;
        alignment-baseline: middle;
        font-size: var(--data-label--font-size);
        font-weight: var(--data-category--font-weight);
    }

    /**
     * Meter graph
     */

    :global(.meter-graph) {
        --graph-title--font-size: var(--global--font-size-m);
        --data-label--color: var(--global--color-white);
    }

    /**
     * Donut graph
     */
    :global(.donut-graph) {
        --graph-title--color: var(--global--color-purple);
    }

    :global(.donut-graph .graph-column:nth-child(n+1)) {
        fill: var(--graph--color-primary);
    }
    :global(.donut-graph .graph-column:nth-child(n+2)) {
        fill: var(--graph--color-face);
    }
    :global(.donut-graph .graph-column:nth-child(n+3)) {
        fill: var(--graph--color-secondary);
    }
    :global(.donut-graph .graph-column:nth-child(n+4)) {
        fill: var(--graph--color-accent-1);
    }
    :global(.donut-graph .graph-column:nth-child(n+5)) {
       fill: var(--graph--color-accent-2);
    }

    :global(.donut-graph .graph-title) {
        text-align: center;
    }

    /**
     * Wellness Summary
     */
    :global(.wellness-summary-list) {
        display: flex;
    }
    :global(.wellness-summary-list > * + *) {
        margin-left: var(--global--spacing-gap);
    }

    :global(.wellness-summary) {
        --chart--title-color: var(--global--color-purple);
        --chart--title-font-size: var(--global--font-size-m);
        --data-label--color: var(--global--color-black);
        --data-label--font-size: var(--global--font-size-m);
    }

    :global(.wellness-summary__location-name) {
        text-transform: uppercase;
    }

    /**
     * Other styles
     */

    .panel-testing-results {
        --chart--title-color: var(--global--color-purple);
    }

    #seven-day-overview {
        --chart--flex-direction: column-reverse;
        --chart--title-font-size: var(--global--font-size-m);
    }

    /**
     * Dashboard layout
    */
    .panel-testing-results {
        grid-area: dash-test;
    }

    .dash-positive {
        grid-area: dash-positive;
    }

    /* .dash-donut { grid-area: dash-donut; } */
    .dash-variants {
        grid-area: dash-variants;
    }

    .dash-vac-rate {
        grid-area: dash-vac-rate;
    }

    .dash-wellness {
        grid-area: dash-wellness;
    }

    .dash-table-container {
        grid-area: dash-table;
    }

    #dashboard-grid {
        display: grid;
        /*grid-template-columns: repeat(6, 1fr);*/
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto;
        gap: 0 60px;
        grid-template-areas:
		  "dash-test"
		  "dash-positive"
		  "dash-variants"
		  "dash-vac-rate"
		  "dash-wellness"
          "dash-table";
        /* margin-bottom:15px; */
    }

    .dashboard-grid-item {
        margin-bottom: 2rem;
    }

    .panel-testing-results {
        display: grid;
        grid-auto-rows: 1fr;
        grid-template-columns: 1.2fr 0.8fr;
        grid-template-rows: 1fr;
        gap: 0px 40px;
        grid-template-areas:
		  "dash-stats dash-bars";
        grid-area: dash-test;


    }

    .dash-test-item {
        width: 100%;

    }

    @media screen and (max-width: 960px) {
        .dash-test-item {
            width: 90%;
        }

        .button-filter {
            font-size: var(--global--font-size-xxs);
            height: 4.5em;
        }

        .dash-pos-donuts {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }

    .dash-stats {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto repeat(3, 1fr);
        gap: 10px 0px;
        grid-template-areas:
	  "."
	  "."
	  ".";
    }

    .dash-stats-item {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dash-stats-item h3 {
        margin: 0;
    }

    .donut-item {
        display: flex;
        background-color: #e0ecf4;
        display: flex;
        justify-content: center;
    }

    .covid-links a {
        font-weight: 600;
        color: #f7fcfd;
        margin: 0 10px;
    }

    /* Dashboard Positive */
    .dash-pos-donuts {

        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 0px 40px;
        grid-template-areas:
		". . .";

    }

    .donut-positive-item {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .chart-label {
        text-align: center;
    }

    .dash-vac-chart {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 0px 40px;
    }

    span.cell {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
        /* justify-content: center;
          align-items: center; */
    }

    span.dot-1 {
        background-color: #bfd3e6;


    }

    span.dot-2 {
        background: #8c96c6;

    }

    span.dot-3 {
        background: #6e016b;

    }

    .cell-label-var {
        text-anchor: middle;
        font-size: 0.65rem;
        color: #777;
        text-transform: uppercase;
        padding: 10px 0;
        text-align: center;
        font-family: "akkurat", -apple-system, sans-serif;
        /* opacity: 50%; */

    }

    h3.vac-title {
        margin: 0 20px
    }


    .stacked-cont {
        margin: 2em 0;
        display: flex;
    }

    .stacked-cont.is-horizontal {
        flex-direction: column;
    }

    .dash-table-wrapper {
        height: 400px;
        overflow: hidden;
        position: relative;
        transition: height linear 200ms;
    }

    .dash-table-wrapper::after {
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgb(255, 255, 255));
        bottom: 0;
        left: 0;
        right: 0;
        content: "";
        display: block;
        height: 180px;
        position: absolute;
        z-index: 10;
    }

    .table-button {
        margin: 0 auto;
        display: block;
        padding: 20px;
        text-align: center;
        text-decoration: none;
        background-color: #6e016b;
        color: #f7fcfd;
        font-size: 16px;
        border-radius: 12px;
    }

    @media screen and (max-width: 600px) {
        #dashboard-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            gap: 40px 60px;
            grid-template-areas:
  			  "dash-test"
  			  "dash-positive"
  			  "dash-variants"
  			  "dash-vac-rate"
  			  "dash-wellness"
  			 "dash-table";
            /* margin-bottom:15px; */
        }

        .dashboard-grid-item {
            margin-bottom: 1rem;
            width: 100vw;
        }

        /* .dash-table {
            overflow: scroll;
        } */
        .dash-stats {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            gap: 10px 0px;
            grid-template-areas:
		  "."
		  "."
		  ".";
        }

        .donut-item {
            flex-flow: wrap-reverse;
        }

        #dash-test-item {
            width: 100vw;
            margin: 1rem 0;

        }

        .panel-testing-results {
            display: grid;
            grid-auto-rows: 1fr;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 0.65fr;
            gap: 0px 40px;
            grid-template-areas:
			  "dash-stats"
			   "dash-bars";
            grid-area: dash-test;


        }

        .donut-chart {
            margin: 1em auto;
        }

        .chart {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dash-positive {
            width: 100vw;
        }

        .dash-pos-donuts {


            display: grid;
            grid-template-columns: 0.5fr 0.5fr;
            grid-template-rows: 0.5fr 0.5fr;
            grid-template-areas:
			". ."
			". .";

            /* gap: 0px 40px; */
            /* grid-template-areas:
              "."
              "."
              "."; */
            /* justify-items: center;
              align-items: center; */
            /* margin: 0 auto; */
            /* width: 50%;
            margin: 0 auto; */
        }

        span#cell {
            height: 20px;
            width: 20px;
        }

        .dash-vac-chart {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            gap: 0px 40px;
        }


        .dash-stacked-vaccination {
            width: 90%;
            margin: 0 auto;
        }
    }

    /**
     * Toolbar
     */
    menu[type=toolbar] {
        display: flex;
    }

    menu[type=toolbar] button {
        background-color: var(--button--secondary--base-background);
        color: var(--button--secondary--base-color);
        border-radius: 0;
        border-left: 1px solid var(--button--secondary--border-color);
        margin: 0;
        padding: calc(0.75 * var(--global--spacing-unit)) calc(1.5 * var(--global--spacing-unit)) calc(0.75 * var(--global--spacing-unit) - 2px);
    }

    menu[type=toolbar] button:first-child {
        border-left: none;
        border-radius: var(--global--border-radius-regular) 0 0 var(--global--border-radius-regular);
    }

    menu[type=toolbar] button:last-child {
        border-radius: 0 var(--global--border-radius-regular) var(--global--border-radius-regular) 0;
    }

    menu[type=toolbar] button + button:not(:last-child) {
    }


    menu button.is-active {
        background-color: var(--button--primary--base-background);
        color: var(--button--secondary--base-color);
    }

    .filter-bar-presets {
        padding: 0;
    }

    .filter-bar-date-range {
        display: block;
        margin: 1rem 1rem 1rem 0;
    }

    .filter-bar-date-range > * {
        padding: 0.25rem;
    }


    /**
     * Buttons
     */
    button {
        align-items: center;
        background-color: var(--button--secondary--base-background);
        border-radius: var(--global--border-radius-regular);
        border: 0;
        color: var(--button--secondary--base-color);
        cursor: pointer;
        display: inline-flex;
        font-family: var(--global--font-signage);
        font-size: 16px;
        font-weight: var(--button--base-weight, bold);
        line-height: 1;
        margin: 0 auto;
        padding: 7px 10px 5px;
        place-self: flex-end;
        position: relative;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        transition: background-color 100ms;
    }

    button.is-primary {
        background-color: var(--button--primary--base-background);
        color: var(--button--primary--base-color);
    }

    /**
     * Datepicker
     */

    .datepicker {
        margin: 0 !important;
    }

    .datepicker-label {
        border: var(--global--border-light-weight, 1px) solid #cbcccb;
        border-radius: 6px;
        padding: 7px 10px;
        cursor: pointer;
        width: 12ch !important;
        /* width: 96px !important; */
    }

    /**
     * Dashboard Intro
     */
    .dashboard-intro {
        margin-top: 2rem;
        margin-bottom: 3rem;
    }

    .footnotes {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: lighter;
    }

</style>
<div class="dashboard-intro">
    <p>On September 6, 2021, Northeastern launched its redesigned Covid-19
        dashboard to track and showcase the metrics that are most meaningful
        among a vaccinated population. The data below is updated daily as soon
        it becomes available from the university’s Life Sciences Testing
        Center.</p>
</div>
{#if covidData.length > 0}
    <div id="dashboard-grid">

        <!-- Dash Test Information - hospitalization, 7 day testing, and stacked bar chart -->
        <div class="dashboard-grid-item panel-testing-results">

            <!-- Dashboard Donut Chart For the week and Get Tested (so stats of covid)-->
            <div class="dash-stats dash-test-item">
                <GraphicTitle
                        title={"Daily Positives for " + new Date(covidData[covidData.length - 1]['Date']).toLocaleDateString()}
                />
                <div class="donut-item dash-stats-item">

                    <div class="donut-chart chart-seven-day-students">
                        <Chart_Donut
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                label="Students"
                                primaryKey="Students Total Positive"
                                secondaryKey="Students Total Negative"
                                valueStyle="default"
                        />
                    </div>

                </div>


                <div class="donut-item dash-stats-item">

                    <div class="donut-chart">
                        <Chart_Donut
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                label="Faculty/Staff"
                                primaryKey="FacStaff Total Positive"
                                secondaryKey="FacStaff Total Negative"
                                valueStyle="default"
                        />
                    </div>

                </div>

                <div class="donut-item dash-stats-item">

                    <div class="donut-chart">
                        <Chart_Donut
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                label="Contractors"
                                primaryKey="Contractor Total Positive"
                                secondaryKey="Contractor Total Negative"
                                valueStyle="default"
                        />

                    </div>
                </div>
            </div>


            <!-- Dashboard Filterable Test Results Stacked Bar Chart -->
            <div class="chart-wrapper" id="chart-results-pos-neg">
                <div class="dash-bars dash-test-item">
                    <GraphicTitle
                            title={"Test Results by Date"}
                    />
                    <div class="filter-bar">


                        <menu type="toolbar" class="filter-bar-presets">
                            <button class="button-filter filter-seven-days is-active"
                                    on:click={setFilterLastSevenDays}>Past 7
                                Days
                            </button>
                            <button class="button-filter filter-thirty-days"
                                    on:click={setFilterLastThirtyDays}>Past 30
                                Days
                            </button>
                            <button class="button-filter filter-semester"
                                    on:click={setFilterThisSemester}>Semester
                            </button>
                        </menu>

                        <div class="filter-bar-date-range">
                            <Datepicker bind:selected={filterStartDate}
                                        bind:dateChosen={isStartDateChosen}
                                        end={filterEndDate}>
                                <div class="datepicker-label">{filterStartDate.toLocaleDateString()}</div>
                            </Datepicker>
                            <span class="date-separator"
                                  aria-label="to">–</span>
                            <Datepicker bind:selected={filterEndDate}
                                        bind:dateChosen={isEndDateChosen}
                                        start={filterStartDate}>
                                <div class="datepicker-label">{filterEndDate.toLocaleDateString()}</div>
                            </Datepicker>
                        </div>
                    </div>
                    <div class="chart-results-pos-neg__chart">
                        <div class="dashboard-legend">
                            <div class="legendCells">
                                <div class="cell1"></div>
                                <div class="cell-label">NEGATIVE TESTS</div>

                            </div>
                            <div class="legendCells">
                                <div class="cell2"></div>
                                <div class="cell-label">POSITIVE TESTS</div>

                            </div>

                        </div>
                        {#key filteredData}
                            <Chart_Bar_Vertical
                                    width={width_stacked}
                                    height={height}
                                    data={filteredData}
                                    xVar={'Date'}
                                    yVar={"Seven-Day Tests"}
                                    yGroups={["Negative Tests", "Positive Tests"]}
                                    colorscheme={negativePositive}
                            />
                        {/key}
                    </div> <!-- /.chart-results-pos-neg__chart -->
                </div>
            </div> <!-- /.chart-results-pos-neg -->


        </div>


        <!-- Dash Positive (Students, Faculty/Staff, and Contractor) -->
        <section class="dashboard-grid-item dash-positive"
                 id="seven-day-overview">

            <GraphicTitle
                    title={"Overview"}
            />
            <div class="dash-pos-donuts">
                <div class="donut-positive-item">

                    <div class="donut-chart">

                        <Chart_Hospitalizations
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                xVar={"Date"}
                                yVar={"Samples Taken"}
                                yA={"Tests Completed"}
                                yB={"Tests in Progress"}
                        />
                        <div class="donut-content dash-stats-item">
                            <h3 class="chart-label">Hospitalizations</h3>
                        </div>

                    </div>
                </div>

                <div class="donut-positive-item">
                    <div class="donut-chart">
                        <Chart_Donut
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                label="Seven-Day Positive Test Rate"
                                primaryKey="Seven-Day Positive Primer"
                                secondaryKey="Seven-Day Negative Primer"
                                valueStyle={{"type": "percent", "compareWith": "Seven-Day Tests Primer"}}
                        />
                        <!--                        <Chart_Donut-->
                        <!--                                width={width_donut}-->
                        <!--                                height={width_donut}-->
                        <!--                                data={covidData}-->
                        <!--                                label="Seven-Day Positive Test Rate"-->
                        <!--                                primaryKey="Seven-Day Positive"-->
                        <!--                                secondaryKey="Seven-Day Negative"-->
                        <!--                                valueStyle={{"type": "percent", "compareWith": "Seven-Day Tests"}}-->
                        <!--                        />-->
                    </div>
                </div>

                <div class="donut-positive-item">
                    <div class="donut-chart">
                        <Chart_Donut
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                label="Campus Wellness Beds in Use"
                                primaryKey="Beds In Use"
                                secondaryKey="Beds Not In Use"
                                valueStyle="default"
                        />
                    </div>
                </div>

            </div>
        </section>


        <!-- Waffle Charts of Variants -->
        <div class="dashboard-grid-item dash-variants"
             style="--chart--key-font-size: var(--global--font-size-xs)">

            <GraphicTitle
                    title={"Variants"}
            />
            <Chart_Covid_Variants
                    isPercentage={false}
                    data={covidData[covidData.length-1]}
                    width={width}
                    columns={25}
                    groups={["SARS-COV-2", "SARS-COV-2 Delta"]}
                    labels={["SARS-COV-2", "SARS-COV-2 Delta"]}
                    colors={["var(--chart--variants-base)", "var(--chart--variants-delta)"]}
                    footnotes={[
                                "* Northeastern’s Life Sciences Testing Center analyzes\n"+
        "                    the genome of viral samples that test positive for COVID-19\n"+
        "                    to determine which strain of the virus is behind a positive\n"+
        "                    test. The lab probes each sample for distinctive markers of\n"+
        "                    known variants of concern: Alpha (B.1.1.7), Beta (B.1.351),\n"+
        "                    Gamma (P.1), and Delta (B.1.617.2). Not all positive tests\n"+
        "                    in this report are from variants of concern, so the number\n"+
        "                    of variants reported here will not match the total positive\n"+
        "                    tests above.",

                            ]}
            />
        </div>


        <!-- Total Vaccination Rates -->

        <div class="dashboard-grid-item dash-vac-rate">

            <GraphicTitle
                    title={"Vaccination Rates"}
            />
            <div class="dash-vac-chart">

                <div class="dash-stacked-vaccination">
                    <div class="stacked-cont is-horizontal">
                        <Meter_Chart
                                length={meterColumnLength}
                                width={meterColumnWidth}
                                value={getMostRecentEntry("Student Vaccinated")}
                                label="Students Vaccination Rate"
                        />
                        <Meter_Chart
                                length={meterColumnLength}
                                width={meterColumnWidth}
                                value={getMostRecentEntry("Fac/Staff Vaccinated")}
                                label="Faculty and Staff Vaccination Rate"
                        />
                    </div>

                </div>
            </div>

        </div>

        <!-- Dashboard Item -Wellness Summary -->

        <div class="dashboard-grid-item dash-wellness">
            <!-- <GraphicTitle
                title={"Wellness and Contact Tracing"}
            /> -->
            <div class="wellness-summary-list">
                <Chart_Wellness_Summary
                        label="Students in Isolation"
                        onCampus={getMostRecentEntry("Students in Isolation On Campus")}
                        offCampus={getMostRecentEntry("Students in Isolation Off Campus")}
                />
                <Chart_Wellness_Summary
                        label="Students in Quarantine"
                        onCampus={getMostRecentEntry("Students in Quarantine On Campus")}
                        offCampus={getMostRecentEntry("Students in Quarantine Off Campus")}
                />
            </div>
            <p class="update-line">*According to the university’s August 18,
                2021 announcement, those who have been identified as close
                contacts no longer have to quarantine as long as they are
                vaccinated.</p>

        </div>

        <!-- Dashboard Item -Svelte Table -->
        <div class="dashboard-grid-item dash-table-container">

            <div class="dashboard-grid-item dash-table-wrapper"
                 id="table-covid">
                <!-- <before></before> -->

                <SvelteTable
                        columns={columns}
                        rows={covidData}
                        sortBy={"Date"}
                        sortOrder={-1}
                        classNameCell={"infocell"}
                >
                </SvelteTable>
            </div>
            <button on:click={toggleTable} class="table-button is-primary">
                <div class="button-label">View Full Table</div>
            </button>
        </div>


    </div>


{/if}
<GraphicFooter
        note={""}
        source={"Northeastern Life Sciences Testing Center and the Broad Institute"}
/>
