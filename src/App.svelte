<script>
    import GraphicTitle from './components/GraphicTitle.svelte'
    import GraphicFooter from './components/GraphicFooter.svelte'
    import Chart_Donut from './charts/chart-donut.svelte';
    import Chart_Single_Bar_Horizontal
        from './charts/chart-single-bar-horizontal.svelte'
    import Chart_Bar_Vertical from './charts/chart-bar-vertical.svelte'
    import Chart_Wellness_Summary from './charts/WellnessSummary.svelte'
    import Chart_Hospitalizations
        from './charts/chart-hospitalizations-current.svelte'
    import SvelteTable from "svelte-table"
    import {csv} from 'd3-fetch'
    import {timeFormat, timeParse} from 'd3-time-format';
    import {negativePositive} from './helpers/colors.js'
    import Datepicker from 'svelte-calendar';

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
        // csv("//news.northeastern.edu/interactive/2021/08/updated-covid-dashboard/datasets/covidupdate_testData.csv").then(function(data,i){
        // csv("//news.northeastern.edu/interactive/2020/08/covid-testing-dashboard-weekly/datasets/testingdata.csv").then(function(data,i){
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
    let width_stacked = width;
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
    ]

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
        --global--font-impact: trim-poster, sans-serif;
        --global--font-versatile: harriet, serif;
        --global--font-signage: akkurat, sans-serif;

        --global--font-weight-thin: 100;
        --global--font-weight-extra-light: 200;
        --global--font-weight-light: 300;
        --global--font-weight-regular: 400;
        --global--font-weight-medium: 500;
        --global--font-weight-semi-bold: 600;
        --global--font-weight-bold: 700;
        --global--font-weight-extra-bold: 800;
        --global--font-weight-black: 900;
        --global--font-weight-ultra-black: 900;

        /**
         * Global font sizes.
         */
        --global--font-size-xxs: 12px;
        --global--font-size-xs: 14px;
        --global--font-size-s: 15px;
        --global--font-size-m: 19px;
        --global--font-size-l: 22px;
        --global--base-line-height: 1.4;

        /**
         * Global brand color palette.
         */
        --global--color-brand-dark-blue: #385775;
        --global--color-brand-white: #fff;

        /**
         * Global color palette.
         */
        --global--color-black: #000;
        --global--color-white: #fff;
        --global--color-red: #d41b2c;
        --global--color-dark-gray: #222;
        --global--color-gray: #555;
        --global--color-light-gray: #99a3b0;
        --global--color-lighter-gray: #cbcccb;
        --global--color-lightest-gray: #efefef;
        --global--color-darkest-blue: #1b3645;
        --global--color-dark-blue: #385775;
        --global--color-blue: #006eb5;
        --global--color-light-blue: #9ebcda;
        --global--color-lighter-blue: #f7fcfd;
        --global--color-accent-blue: #52cfe5;
        --global--color-teal: #00cfb5;
        --global--color-purple: #6e016b;

        --global--color-primary: var(--global--color-purple);
        --global--color-secondary: var(--global--color-lighter-blue);

        /**
         * Global Spacing.
         */
        --global--spacing-unit: 16px;
        --global--spacing-vertical: calc(5 * var(--global--spacing-unit));
        --global--spacing-horizontal: calc(2.5 * var(--global--spacing-unit));
        --global--spacing-gap: 16px;


        /**
         * Global Borders
         */
        --global--border-color-light: var(--global--color-lightest-gray);
        --global--border-color-regular: var(--global--color-lighter-gray);
        --global--border-color-heavy: var(--global--color-gray);
        --global--border-weight-regular: 1px;
        --global--border-radius-tight: 10px;
        --global--border-radius-regular: 12px;
        --global--border-radius-loose: 16px;

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
        --chart--color-primary: var(--global--color-purple);
        --chart--color-secondary: var(--global--color-light-blue);

        --chart--title-font: var(--global--font-signage, inherit);
        --chart--title-font-size: var(--global--font-size-l);
        --chart--title-text-align: center;
        --chart--title-weight: var(--global--font-weight-bold);
        --chart--title-color: var(--global--color-black);

        --chart--label-font: var(--global--font-signage, inherit);
        --chart--label-font-size: var(--global--font-size-l);
        --chart--label-text-align: center;
        --chart--label-weight: var(--global--font-weight-bold);
        --chart--label-color: var(--global--color-black);

        --chart--key-font: var(--global--font-signage, inherit);
        --chart--key-font-size: var(--global--font-size-l);
        --chart--key-text-align: center;
        --chart--key-weight: var(--global--font-weight-bold);
        --chart--key-color: var(--global--color-black);
        --chart--alignment: center;
        --chart--flex-direction: column;

        --chart--variants-base: #bfd3e6;
        --chart--variants-alpha: #8c96c6;
        --chart--variants-delta: #6e016b;

        --chart--footnote-font: var(--global--font-signage, inherit);
        --chart--footnote-font-size: var(--global--font-size-xs);
        --chart--footnote-weight: var(--global--font-weight-light);
        --chart--footnote-color: var(--global--color-black);
        --chart--footnote-line-height: 1.4;
        --chart--footnote-margin: var(--global--spacing-unit);
    }


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
                        title={"Daily Positives for 9/11/2021"}
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
        <!--        <div class="dashboard-grid-item dash-variants" style="&#45;&#45;chart&#45;&#45;key-font-size: var(&#45;&#45;global&#45;&#45;font-size-xs)">-->

        <!--            <GraphicTitle-->
        <!--                    title={"Variants"}-->
        <!--            />-->
        <!--            <Chart_Covid_Variants-->
        <!--                    isPercentage={true}-->
        <!--                    data={covidData[covidData.length-1]}-->
        <!--                    width={width}-->
        <!--                    columns={25}-->
        <!--                    groups={["SARS-COV-2", "SARS-COV-2 Alpha","SARS-COV-2 Delta"]}-->
        <!--                    labels={["SARS-COV-2", "SARS-COV-2 Alpha", "SARS-COV-2 Delta"]}-->
        <!--                    colors={["var(&#45;&#45;chart&#45;&#45;variants-base)", "var(&#45;&#45;chart&#45;&#45;variants-alpha)", "var(&#45;&#45;chart&#45;&#45;variants-delta)"]}-->
        <!--                    footnotes = {[-->
        <!--                        "* Northeastern’s Life Sciences Testing Center analyzes\n"+-->
        <!--"                    the genome of viral samples that test positive for COVID-19\n"+-->
        <!--"                    to determine which strain of the virus is behind a positive\n"+-->
        <!--"                    test. The lab probes each sample for distinctive markers of\n"+-->
        <!--"                    known variants of concern: Alpha (B.1.1.7), Beta (B.1.351),\n"+-->
        <!--"                    Gamma (P.1), and Delta (B.1.617.2). Not all positive tests\n"+-->
        <!--"                    in this report are from variants of concern, so the number\n"+-->
        <!--"                    of variants reported here will not match the total positive\n"+-->
        <!--"                    tests above.",-->

        <!--                    ]}-->
        <!--            />-->
        <!--        </div>-->


        <!-- Total Vaccination Rates -->

        <div class="dashboard-grid-item dash-vac-rate">

            <GraphicTitle
                    title={"Vaccination Rates"}
            />
            <div class="dash-vac-chart">

                <div class="dash-stacked-vaccination">

                    <div class="stacked-cont">

                        <h3 class="vac-title">Student Vaccination Rate</h3>


                        <Chart_Single_Bar_Horizontal
                                width={width_stacked}
                                height={150}
                                data={covidData}
                                xVar={'Date'}
                                yVar={"Student Vaccinated"}
                                yGroups={[ "Total Student Vaccinated", "Student Vaccinated"]}
                                colorscheme={negativePositive}
                        />
                    </div>

                    <div class="stacked-cont">

                        <h3 class="vac-title">Faculty/Staff Vaccination
                            Rate</h3>

                        <Chart_Single_Bar_Horizontal
                                width={width_stacked}
                                height={150}
                                data={covidData}
                                xVar={'Date'}
                                yVar={"Fac/Staff Vaccinated"}
                                yGroups={[ "Total Fac/Staff Vaccinated", "Fac/Staff Vaccinated"]}
                                colorscheme={negativePositive}
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
            <Chart_Wellness_Summary
                    data={covidData}
            />
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
            <!--            Commented out till we have enough rows to overlap-->
            <!--            <button on:click={toggleTable} class="table-button is-primary">-->
            <!--                <div class="button-label">View Full Table</div>-->
            <!--            </button>-->
        </div>


    </div>


{/if}
<GraphicFooter
        note={""}
        source={"Northeastern Life Sciences Testing Center and the Broad Institute"}
/>
