import App from './App.svelte';

let exporter = {}

if (document.getElementById('covid-testing-dashboard')) {
	const app = new App({
		target: document.getElementById('covid-testing-dashboard')
	});

	exporter["app"] = app;
}

export default exporter
