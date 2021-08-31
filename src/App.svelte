<script>
    import GraphicTitle from './components/GraphicTitle.svelte'
    import GraphicFooter from './components/GraphicFooter.svelte'
    import StackedColumnChart from './charts/StackedColumnChart.svelte'
    import StackedColumnChart2 from './charts/StackedColumnChart2.svelte'
    import WellnessSummary from './charts/WellnessSummary.svelte'
    import DonutChart1 from './charts/DonutChart1.svelte'
    import DonutChart2 from './charts/DonutChart2.svelte'
    import DonutChart_Pos from './charts/DonutChart_pos.svelte'
    import DonutChart_Pos2 from './charts/DonutChart_pos2.svelte'
    import DonutChart_Pos3 from './charts/DonutChart_pos3.svelte'
    import DonutChart_total from './charts/DonutChart_total.svelte'
    import WaffleChart from './charts/WaffleChart.svelte'
    import SvelteTable from "svelte-table"
    import {csv} from 'd3-fetch'
    import {timeFormat, timeParse} from 'd3-time-format';
    import {negativePositive} from './helpers/colors.js'
    import * as testData from '../public/datasets/testingdata2.json'
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
     * Sets filter dates to past seven days
     */
    function setFilterLastSevenDays() {
        filterStartDate = getDaysAgo(7);
        filterEndDate = getToday();
    }


    /**
     * Sets filter dates to past thirty days
     */
    function setFilterLastThirtyDays() {
        filterStartDate = getDaysAgo(30);
        filterEndDate = getToday();
    }

    /**
     * Sets filter dates to past thirty days
     */
    function setFilterThisSemester() {

        filterStartDate = new Date("2021/09/09");
        filterEndDate = new Date("2021/12/08");
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


    csv("datasets/covidupdate_testData.csv").then(function (data, i) {
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


</script>

<style>

    .dash-test {
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

    .dash-table {
        grid-area: dash-table;
    }

    #dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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

    .dash-test {
        display: grid;
        grid-auto-rows: 1fr;
        grid-template-columns: 1.2fr 0.8fr;
        grid-template-rows: 1fr;
        gap: 0px 40px;
        grid-template-areas:
		  "dash-stats dash-bars";
        grid-area: dash-test;


    }

    #dash-test-item {
        width: 100%;

    }

    .dash-stats {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 10px 0px;
        grid-template-areas:
	  "."
	  "."
	  ".";
    }

    #dash-stats-item {
        padding: 10px;
    }

    .donut-item {
        display: flex;
        background-color: #e0ecf4;
        /* padding: 10px; */
        /* display: grid;
        grid-template-columns: 0.2fr 1.8fr;
        grid-template-rows: 1fr;
        gap: 0px 0px;
        grid-template-areas:
          ". ."; */
        /* grid-area: dash-test;  */
    }

    .dash-brief {
        color: #f7fcfd;
        background-color: #6e016b;
        /* padding: 10px */
        /* padding: 20px; */
    }

    .covid-links {
        display: flex;
    }

    .covid-links a {
        font-weight: 600;
        color: #f7fcfd;
        margin: 0 10px;
    }

    /* Dashboard Positive since 9/1 */
    .dash-pos-donuts {


        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 0px 40px;
        grid-template-areas:
		". . .";
        /* justify-items: center;
          align-items: center; */
        /* margin: 0 auto; */
        /* width: 50%;
        margin: 0 auto; */
    }

    .donut-positive-item {
        display: flex;
        /* justify-content: center; */
        /* align-items: center; */
    }

    .dash-vac-chart {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 0px 40px;
    }

    span#cell {
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

        .dash-table {
            overflow: scroll;
        }

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

        .dash-test {
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


</style>

{#if covidData.length > 0}
    <div id="dashboard-grid">

        <!-- Dash Test Information - hospitalization, 7 day testing, and stacked bar chart -->
        <div class="dashboard-grid-item dash-test">

            <!-- Dashboard Donut Chart For the week and Get Tested (so stats of covid)-->
            <div class="dash-stats" id="dash-test-item">
                <div class="donut-item" id="dash-stats-item">

                    <div class="donut-chart">
                        <DonutChart1
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                xVar={"Date"}
                                yVar={"Samples Taken"}
                                yA={"Tests Completed"}
                                yB={"Tests in Progress"}
                        />
                    </div>

                    <div class="donut-content">
                        <h3>Hospitalizations</h3>
                        <p class="update-line"><i>Suspendisse egestas est metus,
                            sit amet ultricies magna blandit vitae. Nam quis leo
                            at arcu ultricies bibendum. Curabitur fringilla arcu
                            ligula, ac suscipit purus scelerisque nec. Proin
                            lacinia efficitur consequat.</i></p>
                    </div>
                </div>


                <div class="donut-item" id="dash-stats-item">

                    <div class="donut-chart">

                        <DonutChart2
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                xVar={"Date"}
                                yVar={"Samples Taken"}
                                yA={"Tests Completed"}
                                yB={"Tests in Progress"}
                        />

                    </div>
                    <div class="donut-content" id="dash-stats-item">
                        <h3>Seven-Day Positive Test</h3>
                        <p class="update-line"><i>Suspendisse egestas est metus,
                            sit amet ultricies magna blandit vitae. Nam quis leo
                            at arcu ultricies bibendum. Curabitur fringilla arcu
                            ligula, ac suscipit purus scelerisque nec. Proin
                            lacinia efficitur consequat.</i></p>
                    </div>
                </div>

                <div class="dash-brief" id="dash-stats-item">

                    <h3>Get Tested</h3>

                    <p class="update-line-brief"><i>Suspendisse egestas est
                        metus, sit amet ultricies magna blandit vitae. Nam quis
                        leo at arcu ultricies bibendum. Curabitur fringilla arcu
                        ligula, ac suscipit purus scelerisque nec. Proin lacinia
                        efficitur consequat.</i></p>
                    <div class="covid-links">
                        <p class="schedule-test"><a
                                href="https://northeastern.sharepoint.com/sites/covidscheduler/SitePages/Home.aspx?wa=wsignin1.0">Schedule
                            a Test</a></p>
                        <p class="wellness-check"><a
                                href="https://neuidmsso.neu.edu/idp/profile/SAML2/Redirect/SSO?execution=e3s1">Daily
                            Wellness Check</a></p>
                    </div>
                </div>
            </div>


            <!-- Dashboard Stacked Bar Chart -->

            <div class="dash-bars" id="dash-test-item">
                <GraphicTitle
                        title={"Test Results by Date"}
                />
                <!-- <input bind:value={formattedSelected}> -->
                <!-- <button on:click={() => addNode()}>Add Node</button> -->
                <div id="button-chart-container">
                    <button on:click={setFilterLastSevenDays}>7 Days</button>
                    <button on:click={setFilterLastThirtyDays}>30 Days</button>
                    <button on:click={setFilterThisSemester}>Semester</button>
                </div>
                <Datepicker bind:selected={filterStartDate}
                            bind:dateChosen={isStartDateChosen}
                            end={filterEndDate}/>
                <Datepicker bind:selected={filterEndDate}
                            bind:dateChosen={isEndDateChosen}
                            start={filterStartDate}/>

                <!--                <Datepicker bind:filterEndDate bind:dateChosen>-->
                <!--                    <button class='custom-button'>-->
                <!--                        {filterEndDate.toLocaleDateString()}-->
                <!--                    </button>-->
                <!--                </Datepicker>-->


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
                    <StackedColumnChart
                            width={width_stacked}
                            height={height}
                            data={filteredData}
                            xVar={'Date'}
                            yVar={"Seven-Day Tests"}
                            yGroups={["Seven-Day Negative", "Seven-Day Positive"]}
                            colorscheme={negativePositive}
                    />
                {/key}

            </div>


        </div>


        <!-- Dash Positive (Students, Faculty/Staff, and Contractor) -->
        <div class="dashboard-grid-item dash-positive">

            <GraphicTitle
                    title={"Total Positive Since 9/1"}
            />
            <div class="dash-pos-donuts">
                <div class="donut-positive-item">

                    <div class="donut-chart">

                        <DonutChart_Pos
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                yA={"Students Total Positive"}
                                yB={"Students Total Negative"}
                        />
                    </div>
                </div>

                <div class="donut-positive-item">
                    <div class="donut-chart">
                        <DonutChart_Pos2
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                yA={"Tests Completed"}
                                yB={"Tests in Progress"}
                        />
                    </div>
                </div>

                <div class="donut-positive-item">
                    <div class="donut-chart">

                        <DonutChart_Pos3
                                width={width_donut}
                                height={width_donut}
                                data={covidData}
                                yA={"Tests Completed"}
                                yB={"Tests in Progress"}
                        />
                    </div>
                </div>

            </div>
        </div>


        <!-- Waffle Charts of Variants -->
        <div class="dashboard-grid-item dash-variants">

            <GraphicTitle
                    title={"Variants"}
            />
            <WaffleChart
                    data={covidData[covidData.length-1]}
                    width={width}
                    columns={25}
                    groups={["SARS-COV-2", "SARS-COV-2 Alpha","SARS-COV-2 Delta"]}
            />


            <div class="dashboard-legend">
                <div class="legendCells">
                    <span id="cell" class="dot-1"></span>
                    <div class="cell-label-var">SARS-CoV-2</div>

                </div>
                <div class="legendCells">
                    <span id="cell" class="dot-2"></span>
                    <div class="cell-label-var">SARS-CoV-2 Alpha</div>

                </div>
                <div class="legendCells">
                    <span id="cell" class="dot-3"></span>
                    <div class="cell-label-var">SARS-CoV-2 Delta</div>

                </div>
            </div>
        </div>


        <!-- Total Vaccination Rates -->

        <div class="dashboard-grid-item dash-vac-rate">

            <GraphicTitle
                    title={"Total Vaccination Rate"}
            />
            <div class="dash-vac-chart">
                <div class="donut-chart">

                    <DonutChart_total
                            width={width_donut * 2.25}
                            height={width_donut * 2.25}
                            data={covidData}
                            xVar={"Date"}
                            yVar={"Samples Taken"}
                            yA={"Tests Completed"}
                            yB={"Tests in Progress"}
                    />
                </div>

                <div class="dash-stacked-vaccination">

                    <div class="stacked-cont">

                        <h3 class="vac-title">Student Vaccination Rate</h3>


                        <StackedColumnChart2

                                width={width_stacked}
                                height={150}
                                data={testData.default}
                                xVar={'Date'}
                                yVar={"Total Student Vaccinate"}
                                yGroups={[ "Total Student Vaccinated", "Student Vaccinated"]}
                                colorscheme={negativePositive}
                        />
                    </div>

                    <div class="stacked-cont">

                        <h3 class="vac-title">Faculty/Staff Vaccination
                            Rate</h3>

                        <StackedColumnChart2

                                width={width_stacked}
                                height={150}
                                data={testData.default}
                                xVar={'Date'}
                                yVar={"Total FacStaff Vaccinated"}
                                yGroups={[ "Total FacStaff Vaccinated", "FacStaff Vaccinated"]}
                                colorscheme={negativePositive}
                        />
                    </div>

                    <div class="stacked-cont">

                        <h3 class="vac-title">Student Vaccination Rate</h3>

                        <StackedColumnChart2

                                width={width_stacked}
                                height={150}
                                data={testData.default}
                                xVar={'Date'}
                                yVar={"Total Contractor Vaccinated"}
                                yGroups={["Total Contractor Vaccinated", "Contractor Vaccinated"]}
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
            <WellnessSummary
                    data={covidData}
            />
        </div>

        <!-- Dashboard Item -Svelte Table -->

        <div class="dashboard-grid-item dash-table">
            <SvelteTable
                    columns={columns}
                    rows={covidData}
                    sortBy={"Date"}
                    sortOrder={-1}
                    classNameCell={"infocell"}
            >
            </SvelteTable>
        </div>


    </div>


{/if}
<GraphicFooter
        source={"Northeastern Life Sciences Testing Center and the Broad Institute"}
        note={""}
/>
