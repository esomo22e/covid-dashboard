<!-- Dash Positive (Students, Faculty/Staff, and Contractor) -->

<div class="dashboard-grid-item dash-positive">

<GraphicTitle
    title={"Total Positive Since 9/1"}
/>
<div class="dashboard-donuts">
<div class="donut-positive-item">
<DonutChart
    width={width_donut}
    height={width_donut}
    data={coviddata}
    xVar={"Date"}
    yVar={"Samples Taken"}
    yA={"Tests Completed"}
    yB={"Tests in Progress"}
/>
</div>

<div class="donut-positive-item">
<DonutChart
    width={width_donut}
    height={width_donut}
    data={coviddata}
    xVar={"Date"}
    yVar={"Samples Taken"}
    yA={"Tests Completed"}
    yB={"Tests in Progress"}
/>
</div>

<div class="donut-positive-item">
<DonutChart
    width={width_donut}
    height={width_donut}
    data={coviddata}
    xVar={"Date"}
    yVar={"Samples Taken"}
    yA={"Tests Completed"}
    yB={"Tests in Progress"}
/>
</div>

</div>
</div>





<div class="dashboard-grid-item dash-variants">

<GraphicTitle
    title={"Variants"}
/>
<WaffleChart
data={waffledata.default[0]}
width = {width}
columns={21}
groups = {["red", "green","blue"]}
/>
</div>


<!-- Dashboard Item -Vaccination Rate -->
<div class="dashboard-grid-item dash-vac-rate">

<GraphicTitle
title={"Total Vaccination Rate"}
/>
<div class = "dash-vac-chart">
<DonutChart
width={width_donut}
height={width_donut}
data={coviddata}
xVar={"Date"}
yVar={"Samples Taken"}
yA={"Tests Completed"}
yB={"Tests in Progress"}
/>
<div class = "dash-stacked-vaccination">

<StackedColumnChart2

width={width2}
height={width2 * 1}
data={testData.default}
xVar={'Date'}
yVar={"Seven-Day Tests"}
yGroups={["Seven-Day Negative", "Seven-Day Positive"]}
colorscheme={negativepositive}
/>
</div>
</div>

</div>





<!-- Dashboard Item -Wellness Summary -->

<div class="dashboard-grid-item dash-wellness">
    <!-- <GraphicTitle
        title={"Wellness and Contact Tracing"}
    /> -->
    <WellnessSummary
        data={coviddata}
    />
</div>

<!-- Dashboard Item -Svelte Table -->

<div class="dashboard-grid-item dash-table">
<SvelteTable
columns={columns}
rows={coviddata}
sortBy={"Date"}
sortOrder={-1}
classNameCell={"infocell"}
>
</SvelteTable>
</div>

</div>
