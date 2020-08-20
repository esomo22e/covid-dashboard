import App from './App.svelte';
import Brief from './BriefOnly.svelte';

const app = new App({
	target: document.getElementById('covid-testing-dashboard')
});

const brief = new Brief({
	target: document.getElementById('covid-test-brief')
});

export default { app, brief };
