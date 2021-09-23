<script>
    import {digitFormat} from '../helpers/digitFormat.js'

    export let onCampus = {onCampus};
    export let offCampus = {offCampus};
    export let label = {label};
</script>

<style>
    .wellness-summary {
        background-color: #e0ecf4;
        border-radius: 3px;
        flex: 1 1 0;
        padding: 20px;
        margin: 20px;

    }

    .wellness-summary__label {
        color: var(--chart--title-color);
        font-size: var(--chart--title-font-size);
        font-weight: var(--chart--title-weight);
        margin: 0;
    }

    .wellness-summary__location {
        flex: 1 1 auto;
    }
    .wellness-summary__location-list {
        display: flex;
        justify-content: stretch;
    }

    .wellness-summary__location-name {
        font-size: var(--data-category--font-size);
        color: var(--data-category--color);
        font-weight: var(--data-category--font-weight);
        margin-bottom: 0;
    }

    .wellness-summary__value {
        color: var(--data-label--color);
        font-weight: var(--data-label--font-weight);
        font-size: var(--data-label--font-size);
    }
</style>

<div class="wellness-summary">
    <h3 class="wellness-summary__label">{label}</h3>
    <div class="wellness-summary__location-list">
        <div class="wellness-summary__location">
            <h4 class="wellness-summary__location-name">On Campus</h4>
            <div class="wellness-summary__value">{digitFormat(onCampus)}</div>
        </div>
        <div class="wellness-summary__location">
            <h4 class="wellness-summary__location-name">Off Campus</h4>
            <div class="wellness-summary__value">{digitFormat(offCampus)}</div>
        </div>
    </div>
</div>