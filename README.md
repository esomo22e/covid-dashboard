# COVID-19 testing dashboard

This code powers the live data present where we're reporting Northeastern's COVID test results, on the [coronavirus information landing page](http://news.northeastern.edu/coronavirus/) and the [full dashboard](http://news.northeastern.edu/coronavirus/reopening/testing-dashboard).

## Get started

```bash
npm install
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.


## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

Then upload the /public/ folder to the FTP server.

NOTE: if you make any changes that are uploaded to the FTP server, it's always a good idea to then go into the Testing Dashboard's WordPress page, and bump up the version query string that's at the end of the URLs in the "external resources", e.g. if it's currently at `?ver=1.25`, pop it up to `?ver=1.26`. This helps to ensure that users don't get served with cached versions of the JS and CSS files that might cause the dashboard to look strange for them. 

## Daily data updates

The data that powers this dashboard does NOT live in this Github repo or on our FTP server. We're using Google Sheets to keep this powered.

Each day, the cells in the Google Sheet that are filled in white are the ones that need to be manually updated. The cells that are filled in red rely on formulas to compute totals and 7-day averages; to fill those in, once the white ones are all entered for the day, you can highlight the red cells from the previous day and then drag those down -- the formulas should auto-populate.

As an extra attempt to try to prevent typos and mathematic errors in the Google Sheet, the cells for "Tests Completed" and "Positive Tests" use conditional formatting to display green text if the test numbers add up correctly, and red numbers if they do not.

## General principles

- Graphics themselves are largely built in the templates seen in the /charts/ folder. The top-level files mostly handle the loading of data.
- Much of the layout is handled using CSS Grid templates. This is most clearly seen in the overall dashboard view, inside of App.svelte. However, there are also some grids within grids, mostly in the WellnessSummary and the Brief templates, too. The newest version of Chrome comes with helpful CSS Grid highlighting when you're inspecting elements.
- It can be difficult to figure out the proper place for CSS in a Svelte app. In theory, CSS that is meant to be scoped to a specific component can go in the Style area of a .Svelte file. But there's also the `/public/global.css` stylesheet that gets called everywhere, too, which theoretically is ideal for shared look-and-feel items like fonts.


## File structure

### main.js

This is the primary file that starts the Svelte app. Since the same code runs on our main dashboard page and the landing page, it calls in two separate Svelte apps (App and BriefOnly) and, depending on which of the HTML IDs is present on the page, figures out which one to fire up. (This shouldn't need to be edited, unless one of those HTML IDs changes in the WordPress templates.)

In standard Svelte style, all of the .svelte files start with a JavaScript section, then a CSS section, and finally the HTML.

### App.Svelte

This is the big file that runs our live dashboard page. Other components of that dashboard are nested inside.
- Note that the SvelteTable component, inside of this file, is not a custom component but is provided by a plugin. The configuration for that particular piece of the dashboard is provided by the `columns` variable, which provides an array of objects inside of App.svelte.

### BriefOnly.svelte

This is a smaller piece of code that loads the data for the box that's only on the coronavirus reopening landing page.

### /charts/Brief.svelte

This displays the small illustration + numbers at the very top of the dashboard. It uses CSS Grid to handle layout and positioning.

### /charts/BriefHomepage.svelte

This is a smaller and differently styled variation on the previous "Brief" that displays the latest numbers on our coronavirus reopening landing page.

### /charts/DonutChart.svelte

Displays the NU 7-day positive rate as a donut chart on the dashboard.

### /charts/MultiLineChart.svelte

Allows for display of multiple data series as a time series line chart. This was included to compare NU's and the state's positive rates over time, as well as track the progression of our wellness/contact tracing numbers. Those versions have not been used to date, however the template remains here just in case it can be used somewhere.

### /charts/StackedColumnChart.svelte

Used to display positive and negative tests raw numbers, as well as potentially to show positives broken down by groups (students, staff, etc).

### /charts/WellnessSummary.svelte

This is the component that creates those gray boxes that display the updated contact tracing and wellness data on the main dashboard.

### /components/

In here are just two components to create headers and footers on the main dashboard.

### /helpers/colors.js

This is where we keep arrays of color hex codes, in ways that are easily used by D3 color scales. The main one being used is the "negativepositive" color scale, though there is also an array of three pastel type colors that were intended to be used to color-code the different groups on campus (students, faculty/staff, contractor employees).

### /helpers/digitFormat.js

This is a small vanilla JavaScript function that's intended to catch numbers that aren't numbers or aren't formatted correctly, and display some text to that effect instead of throwing a bug.
# covid-dashboard
