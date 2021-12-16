<script>
    import {digitFormat} from '../helpers/digitFormat.js'
    let el;
    export let onCampus = {onCampus};
    export let offCampus = {offCampus};
    export let label = {label};
    export let hasAccent = false;

    let classNames=[
        "graph",
        "wellness-summary-graph"
    ];

    if(hasAccent) {
        classNames.push("has-accent");
    }

    const getClassNames = () => {
        return classNames.join(" ");
    }
</script>

<figure class="{getClassNames()}">
    <h3 class="graph-title">{label}</h3>
    <div class="wellness-summary__location-list">
        <div class="wellness-summary__location">
            <h4 class="data-category">On Campus</h4>
<!--            <div class="data-label">{digitFormat(onCampus)}</div>-->
        </div>
        <div class="wellness-summary__location">
            <h4 class="data-category">Off Campus</h4>
<!--            <div class="data-label">{digitFormat(offCampus)}</div>-->
        </div>
    </div>
</figure>