import App from './App.svelte';
import BriefOnly from './BriefOnly.svelte';

let exporter = {}

if (document.getElementById('covid-testing-dashboard')) {
	const app = new App({
		target: document.getElementById('covid-testing-dashboard')
	});

	exporter["app"] = app;
}

if (document.getElementById('homepage-dashboard-brief')) {
	const homepagebrief = new BriefOnly({
		target: document.getElementById('homepage-dashboard-brief')
	});

	exporter["homepagebrief"] = homepagebrief;
}

export default exporter
