<script>
    import {onMount} from 'svelte';
    import {scaleOrdinal} from 'd3-scale';
    import {mouse, select} from 'd3-selection';
    import {entries} from 'd3-collection';
    import {path} from 'd3-path';
    import {arc, pie} from 'd3-shape';
    import Chart_Bar_Vertical from './vertical-bar-graph.svelte'
    import {negativePositive} from '../helpers/colors.js'
    import Datepicker from 'svelte-calendar';


    export let data = {data};
    export let title = {title};
    export let hasAccent = false;

    let classNames = [
        "graph",
        "results-by-date"
    ];

    if (hasAccent) {
        classNames.push("has-accent");
    }

    const getClassNames = () => {
        return classNames.join(" ");
    }


    let d3 = {
        select: select,
    }
    let el;


    /**
     * Gets a date object for today.
     *
     * @since 2.0
     *
     * @return Date
     */
    function getToday() {
        let todaysDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        return todaysDate;
    }

    function getMostRecentDate() {
        let parts = data[data.length - 1]["date"].split("/");

        for (let i = 0; i < parts.length; i++) {
            parts[i] = (10 > parts[i]) ? "0" + parts[i].toString() : parts[i].toString();
        }

        return new Date(`${parts[2]}-${parts[0]}-${parts[1]}T00:00:00-0400`);
    }

    /**
     * Gets a date object for a specified number of days ago.
     *
     * @since 2.0
     *
     * @return Date
     */
    function getDaysAgo(daysAgo) {
        let daysAgoDate = new Date(getMostRecentDate() - daysAgo * 24 * 60 * 60 * 1000);
        return daysAgoDate;
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
        filterEndDate = getMostRecentDate();
        setActiveFilter('.filter-seven-days');
    }


    /**
     * Sets filter dates to past thirty days
     */
    function setFilterLastThirtyDays() {
        filterStartDate = getDaysAgo(30);
        filterEndDate = getMostRecentDate();
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
    let filterEndDate = getMostRecentDate();
    let filterStartDate = getDaysAgo(7);
    let isStartDateChosen = false;
    let isEndDateChosen = false;

    /**
     * Filters test results by date.
     *
     * @since 2.0
     */
    $: filteredData = data.filter(function (d) {
        const START_DATE = new Date(filterStartDate).getTime();
        const END_DATE = new Date(filterEndDate).getTime();
        const COMPARE_DATE = new Date(d["date"]).getTime();
        return (COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE);
    });

</script>

<figure bind:this={el} class="{getClassNames()}">
    <div class="chart-wrapper" id="chart-results-pos-neg">
        <div class="dash-bars dash-test-item">
            <h2 class="section-heading">{title}</h2>
            <div class="filter-bar">
                <menu class="filter-bar-presets" type="toolbar">
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
                    <Datepicker bind:dateChosen={isStartDateChosen}
                                bind:selected={filterStartDate}
                                end={filterEndDate}>
                        <div class="datepicker-label">{filterStartDate.toLocaleDateString()}</div>
                    </Datepicker>
                    <span aria-label="to"
                          class="date-separator">–</span>
                    <Datepicker bind:dateChosen={isEndDateChosen}
                                bind:selected={filterEndDate}
                                start={filterStartDate}>
                        <div class="datepicker-label">{filterEndDate.toLocaleDateString()}</div>
                    </Datepicker>
                </div>
            </div>
            <div class="graph-visual-wrapper">
                <div class="chart-results-pos-neg__chart">
                    {#key filteredData}
                        <Chart_Bar_Vertical
                                width=500
                                height=480
                                data={filteredData}
                                category={'date'}
                                value={"total_tests"}
                                groups={["negative_tests", "positive_tests"]}
                                groupLabels={["Negative Tests", "Positive Tests"]}
                                columnDescription={"On {date} there were  {negative_tests} negative and {positive_tests} positive tests."}

                        />
                    {/key}
                </div> <!-- /.chart-results-pos-neg__chart -->
            </div>
        </div>
    </div> <!-- /.chart-results-pos-neg -->
</figure>
