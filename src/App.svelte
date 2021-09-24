<script>
    import GraphicTitle from './components/GraphicTitle.svelte'
    import GraphicFooter from './components/GraphicFooter.svelte'
    import Chart_Donut from './charts/chart-donut.svelte';
    import Meter_Chart from './charts/meter-chart.svelte';
    import Chart_Bar_Vertical from './charts/chart-bar-vertical.svelte'
    import Chart_Wellness_Summary from './charts/wellness-summary.svelte'
    import Data_Point from './charts/data-point.svelte'
    import SvelteTable from "svelte-table"
    import Waffle_Chart from "./charts/waffle-chart.svelte";
    import {csv} from 'd3-fetch'
    import {timeFormat, timeParse} from 'd3-time-format';
    import {negativePositive} from './helpers/colors.js'
    import Datepicker from 'svelte-calendar';
    import './global.css';

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

    function getMostRecentEntry(prop = null) {
        return (null != prop) ? covidData[covidData.length - 1][prop] : covidData[covidData.length - 1];
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
        <div class="dashboard-grid-item panel-testing-results">
            <section id="daily-positives">
                <h2 class="section-heading">Daily Positives for {new Date(getMostRecentEntry('Date')).toLocaleDateString()}</h2>
                <div class="daily-positives-list">
                    <Chart_Donut
                            width={width_donut}
                            height={width_donut}
                            value={[
                                getMostRecentEntry("Students Total Positive"),
                                getMostRecentEntry("Students Total Negative"),
                                ]}
                            label="Students"
                            valueStyle="default"
                            hasAccent={true}
                    />
                    <Chart_Donut
                            width={width_donut}
                            height={width_donut}
                            value={[
                                getMostRecentEntry("FacStaff Total Positive"),
                                getMostRecentEntry("FacStaff Total Negative"),
                                ]}
                            label="Faculty/Staff"
                            hasAccent={true}
                    />
                    <Chart_Donut
                            width={width_donut}
                            height={width_donut}
                            value={[
                                getMostRecentEntry("Contractor Total Positive"),
                                getMostRecentEntry("Contractor Total Negative"),
                                ]}
                            label="Contractors"
                            hasAccent={true}
                    />
                </div>
            </section>


            <!-- Dashboard Filterable Test Results Stacked Bar Chart -->
            <div class="chart-wrapper" id="chart-results-pos-neg">
                <div class="dash-bars dash-test-item">
                    <h2 class="section-heading">Test Results by Date</h2>
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
        <section id="overview">
            <h2 class="section-heading">Overview</h2>
            <div class="graph-group">
                <Data_Point
                        width={width_donut}
                        height={width_donut}
                        value=0
                        label="Hospitalizations"
                />

                <Chart_Donut
                        width={width_donut}
                        height={width_donut}
                        value={[
                                getMostRecentEntry("Seven-Day Positive Primer"),
                                getMostRecentEntry("Seven-Day Negative Primer"),
                                ]}
                        label="Seven-Day Positive Test Rate"
                        isPercent={true}
                />

                <Chart_Donut
                        width={width_donut}
                        height={width_donut}
                        value={[
                                getMostRecentEntry("Beds In Use"),
                                getMostRecentEntry("Beds Not In Use"),
                                ]}
                        label="Campus Wellness Beds in Use"
                />
            </div>
        </section>


        <!-- Waffle Charts of Variants -->
        <section id="covid-variants">
            <h2 class="section-heading">Variants</h2>

            <Waffle_Chart
                    isPercentage={false}
                    data={getMostRecentEntry()}
                    width={width}
                    columns={25}
                    value={[
                        getMostRecentEntry("SARS-COV-2"),
                        getMostRecentEntry("SARS-COV-2 Delta"),
                        ]}
                    labels={["SARS-COV-2", "SARS-COV-2 Delta"]}
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
        </section>


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
                        hasAccent={true}
                />
                <Chart_Wellness_Summary
                        label="Students in Quarantine"
                        onCampus={getMostRecentEntry("Students in Quarantine On Campus")}
                        offCampus={getMostRecentEntry("Students in Quarantine Off Campus")}
                        hasAccent={true}
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
