<script>
	import StackedBar from './charts/stacked-bar-alternate.svelte';
	import Donut_Graph from './charts/donut-graph.svelte';
	import Meter_Graph from './charts/meter-graph.svelte';
	import Waffle_Graph from './charts/waffle-graph.svelte';
	import Data_Point from './charts/data-point.svelte';
	import Results_By_Date from './charts/results-by-date.svelte';
	import Covid_Variants_Stacked_Bar
		from './charts/covid-variants-stacked-bar.svelte';
	import Chart_Wellness_Summary from './charts/wellness-summary.svelte';
	import Svelte_Table from 'svelte-table';
	// import {csv} from 'd3-fetch'
	import { timeFormat, timeParse } from 'd3-time-format';
	import './global.css';

	const meterColumnWidth = 66;
	const meterColumnLength = 406;

	/**
	 * Get COVID dataset
	 *
	 * @since 1.0
	 */
	$: covidData = parseCovidData();

	const parseTime = timeParse( '%m/%d/%y' );
	const formatDate = timeFormat( '%m/%d/%y' );

	// These are the columns for the table portion.
	const tableColumns = [
		{
			key        : 'date',
			title      : 'Date',
			value      : v => new Date( v[ 'date' ] ),
			renderValue: v => v[ 'date' ],
			sortable   : true,
			headerClass: 'text-left',
			class      : 'date-col',
		},
		{
			key        : 'total_tests',
			title      : 'Tests Completed',
			value      : v => v[ 'total_tests' ],
			sortable   : true,
			headerClass: 'text-left',
		},
		{
			key        : 'negative_tests',
			title      : 'Negative Tests',
			value      : v => v[ 'negative_tests' ],
			sortable   : true,
			headerClass: 'text-left',
		},
		{
			key        : 'negative_rate',
			title      : 'Negative Rate',
			value      : v => (
					( v[ 'negative_tests' ] / v[ 'total_tests' ] ).toLocaleString(
							undefined, {
								style                : 'percent',
								minimumFractionDigits: 2,
							} )
			),
			sortable   : true,
			headerClass: 'text-left',
		},
		{
			key        : 'positive_tests',
			title      : 'Positive Tests',
			value      : v => v[ 'positive_tests' ],
			sortable   : true,
			headerClass: 'text-left',
		},
		{
			key        : 'positive_rate',
			title      : 'Positive Rate',
			value      : v => (
					( v[ 'positive_tests' ] / v[ 'total_tests' ] ).toLocaleString(
							undefined, {
								style                : 'percent',
								minimumFractionDigits: 2,
							} )
			),
			sortable   : true,
			headerClass: 'text-left',
		},
	];

	/**
	 * Filters test results by date.
	 *
	 * @since 2.0
	 */
	let todaysDate = new Date( new Date().getFullYear(), new Date().getMonth(),
	                           new Date().getDate(),
	);

	function getStartDate() {
		let daysAgo = 7;
		let date = new Date( todaysDate - daysAgo * 24 * 60 * 60 * 1000 );

		return date;
	}

	function parseCovidData() {
		let data = getCovidData();

		data.sort( function compare( a, b ) {
			let dateA = new Date( a[ 'date' ] );
			let dateB = new Date( b[ 'date' ] );
			return dateA - dateB;
		} );

		for ( let i = 0; i < data.length; i++ ) {
			let date = new Date( data[ i ][ 'date' ] + 'T00:00:00-0400' );
			data[ i ][ 'date' ] = date.toLocaleDateString();
		}

		return data;
	}

	/**
	 * Gets the data for the most recent day
	 */

	function getMostRecentEntry( prop = null ) {
		return ( null != prop ) ?
				covidData[ covidData.length - 1 ][ prop ] :
				covidData[ covidData.length - 1 ];
	}

	/**
	 * Gets the total quarantined on campus.
	 */
	function getQuarantineTotalOnCampus( entry ) {
		return entry[ 'traced_contacts_on_campus' ] +
				entry[ 'self_reported_on_campus' ];
	}

	/**
	 * Gets the total quarantined off campus.
	 */
	function getQuarantineTotalOffCampus( entry ) {
		return entry[ 'traced_contacts_off_campus' ] +
				entry[ 'self_reported_off_campus' ];
	}

	/**
	 * Filter dates
	 */
	let filterEndDate = getToday();
	let filterStartDate = getDaysAgo( 7 );

	/**
	 * Gets a date object for today.
	 *
	 * @since 2.0
	 *
	 * @return Date
	 */
	function getToday() {
		let todaysDate = new Date( new Date().getFullYear(), new Date().getMonth(),
		                           new Date().getDate(),
		);
		return todaysDate;
	}

	/**
	 * Gets a date object for a specified number of days ago.
	 *
	 * @since 2.0
	 *
	 * @return Date
	 */
	function getDaysAgo( daysAgo ) {
		let daysAgoDate = new Date( getToday() - daysAgo * 24 * 60 * 60 * 1000 );
		return daysAgoDate;
	}

	/**
	 * Filters test results by date.
	 *
	 * @since 2.0
	 */
	$: filteredData = covidData.filter( function( d ) {
		const START_DATE = new Date( filterStartDate ).getTime();
		const END_DATE = new Date( filterEndDate ).getTime();
		const COMPARE_DATE = new Date( d[ 'date' ] ).getTime();
		return ( COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE );
	} );

	function getSevenDayTotal() {
		let cases = 0;
		for ( let i = 0; i < filteredData.length; i++ ) {
			cases += filteredData[ i ][ 'total_tests' ];
		}

		return cases;
	}

	function getSevenDayPositive() {
		let cases = 0;
		for ( let i = 0; i < filteredData.length; i++ ) {
			cases += filteredData[ i ][ 'positive_tests' ];
		}

		return cases;
	}

	function getSevenDayNegative() {
		let cases = 0;
		for ( let i = 0; i < filteredData.length; i++ ) {
			cases += filteredData[ i ][ 'negative_tests' ];
		}

		return cases;
	}

	/**
	 * Toggles view of table
	 *
	 * @since 2.0
	 */
	let initialTableHeight;
	let fullTableHeight;

	function toggleTable() {
		const tableWrapper = document.querySelector( '.collapsable-table-wrapper' );
		const buttonToggleLabel = document.querySelector(
				'.table-button .button-label' );
		const buttonToggleLabelInitial = 'Expand Table';
		const buttonToggleLabelExpanded = 'Collapse Table';

		if ( ! initialTableHeight ) {
			initialTableHeight = tableWrapper.offsetHeight;
			tableWrapper.style.height = 'auto';
			fullTableHeight = tableWrapper.offsetHeight;
			tableWrapper.style.height = initialTableHeight + 'px';
		}

		if ( tableWrapper.classList.contains( 'is-expanded' ) ) {
			tableWrapper.classList.remove( 'is-expanded' );
			tableWrapper.style.height = initialTableHeight + 'px';
			buttonToggleLabel.innerText = buttonToggleLabelInitial;
		}
		else {
			tableWrapper.classList.add( 'is-expanded' );
			tableWrapper.style.height = fullTableHeight + 'px';
			buttonToggleLabel.innerText = buttonToggleLabelExpanded;
		}
	}

	function insertAfter( referenceNode, newNode ) {
		referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
	}
</script>
<section id="intro">
    <p>On September 6, 2021, Northeastern launched its redesigned Covid-19
        dashboard to track and showcase the metrics that are most meaningful
        among a vaccinated population. The data below is updated daily as soon
        it becomes available from the university’s Life Sciences Testing
        Center.</p>
</section>

{#if covidData.length > 0}
    <div class="dashboard">
        <section id="testing-results">
            <section id="daily-positives">
                <h2 class="section-heading">Daily Positives
                    for {getMostRecentEntry( 'date' )}</h2>
                <div class="daily-positives__list">
                    <Donut_Graph
                            width=125
                            values={[
                                getMostRecentEntry("positive_students"),
                                getMostRecentEntry("negative_tests"),
                                ]}
                            thickness=20
                            label="Students"
                            valueStyle="default"
                            hasAccent={true}
                    />
                    <Donut_Graph
                            width=125
                            values={[
                                getMostRecentEntry("positive_faculty_staff"),
                                getMostRecentEntry("negative_tests"),
                                ]}
                            thickness=20
                            label="Faculty/Staff"
                            hasAccent={true}
                    />
                    <Donut_Graph
                            width=125
                            values={[
                                getMostRecentEntry("positive_contractors"),
                                getMostRecentEntry("negative_tests"),
                                ]}
                            thickness=20
                            label="Contractors"
                            hasAccent={true}
                    />
                </div>
            </section>


            <!-- Dashboard Filterable Test Results Stacked Bar Chart -->
            <section id="results-by-date">
                <Results_By_Date
                        data={covidData}
                        title="Test Results by Date"
                />
            </section>

        </section>


        <!-- Dash Positive (Students, Faculty/Staff, and Contractor) -->
        <section id="overview">
            <h2 class="section-heading">Overview</h2>
            <div class="graph-group">
                <Data_Point
                        width=200
                        height=200
                        value={getMostRecentEntry('hospitalizations')}
                        label="Hospitalizations"
                />

                {#key filteredData}
                    <Donut_Graph
                            width=200
                            values={[
                                getSevenDayPositive(),
                                getSevenDayTotal()
                                ]}
                            label="Seven-Day Positive Test Rate"
                            thickness=20
                            isPercent={true}
                    />
                {/key}

                <Donut_Graph
                        width=200
                        values={[
                                getMostRecentEntry("beds_in_use"),
                                getMostRecentEntry("total_beds"),
                                ]}
                        thickness=20
                        label="Campus Wellness Beds in Use"
                />
            </div>
        </section>


        <!-- Waffle Charts of Variants -->
        <section id="covid-variants">
            <h2 class="section-heading">Total Variants</h2>
            <Covid_Variants_Stacked_Bar
                    data={getMostRecentEntry()}
            />
        </section>

        <!-- Total Vaccination Rates -->
        <section id="vaccination-rates">
            <h2 class="section-heading">Vaccination Rates</h2>
            <div class="dash-vac-chart">

                <div class="dash-stacked-vaccination">
                    <div class="stacked-cont is-horizontal">
                        <Meter_Graph
                                length={meterColumnLength}
                                width={meterColumnWidth}
                                value={getMostRecentEntry("vax_rate_students")}
                                label="Students Vaccination Rate"
                        />
                        <Meter_Graph
                                length={meterColumnLength}
                                width={meterColumnWidth}
                                value={getMostRecentEntry("vax_rate_faculty_staff")}
                                label="Faculty and Staff Vaccination Rate"
                        />
                    </div>

                </div>
            </div>
        </section>

        <!-- Wellness summary -->
        <section id="wellness-summary">
            <div class="wellness-summary__list">
                <Chart_Wellness_Summary
                        label="Students in Isolation"
                        data={[
                            getMostRecentEntry("isolate_on_campus"),
                            getMostRecentEntry("isolate_off_campus"),
                            ]}
                        dataLabels={[
                            "On-Campus",
                            "Off-Campus",
                        ]}
                        hasAccent={true}
                />
                <Chart_Wellness_Summary
                        label="Students in Quarantine"
                        data={[
                            getMostRecentEntry("newly_identified_on_campus"),
                            getMostRecentEntry("newly_identified_off_campus"),
                            getQuarantineTotalOnCampus(getMostRecentEntry()),
                            getQuarantineTotalOffCampus(getMostRecentEntry()),
                            ]}
                        dataLabels={[
                            "Newly Identified On-Campus",
                            "Newly Identified <wbr/>Off-Campus",
                            "Total On-Campus",
                            "Total Off-Campus",
                        ]}
                        hasAccent={true}
                />
            </div>
            <footer class="wellness-summary__footer">
                <p class="footnote">* According to the university’s August 18,
                    2021 announcement, those who have been identified as close
                    contacts no longer have to quarantine as long as they are
                    vaccinated.</p>
            </footer>
        </section>

        <!-- Data table -->
        <section id="data-table">
            <div class="collapsable-table-wrapper">
                <Svelte_Table
                        columns={tableColumns}
                        rows={covidData}
                        sortBy={"date"}
                        sortOrder={-1}
                        classNameCell={"infocell"}
                >
                </Svelte_Table>
            </div>
            <button on:click={toggleTable} class="table-button is-primary">
                <div class="button-label">View Full Table</div>
            </button>
            <footer class="data-table__footer">
                <p class="footnote">Starting on November 28th, 2021 the testing
                    centers are closed on Sundays.<br>
                    <b class="footnote-offset">Source:</b>
                    Northeastern Life Sciences Testing Center and the Broad
                    Institute</p>
            </footer>
        </section>


    </div>


{/if}
