import App from './App.svelte';
import Brief from './BriefOnly.svelte';


if (document.getElementById('covid-testing-dashboard')) {
	const app = new App({
		target: document.getElementById('covid-testing-dashboard')
	});
	export default app;
}



// const app = new Brief({
// 	target: document.getElementById('covid-test-brief')
// });
