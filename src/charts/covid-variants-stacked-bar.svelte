<script>
	import Stacked_Bar_Alternate from './stacked-bar-alternate.svelte';

	export let data = { data };
	const maxWidth = 1100;
	const orderedImportantVariants = [
		{
			'key'  : 'strain_sars_cov_2_omicron',
			'color': 'var(--cov-2-variant--omicron)',
		},
		{
			'key'  : 'strain_sars_cov_2_kappa',
			'color': 'var(--cov-2-variant--kappa)',
		},
		{
			'key'  : 'strain_sars_cov_2_delta',
			'color': 'var(--cov-2-variant--delta)',
		},
	];
	let orderedVariantKeys = [];
	let orderedVariantColors = [];
	let isSmallViewport = ( window.innerWidth >= 600 );
	let variantNumbers = fetchVariantData();

	function getWidth() {
		return Math.min( window.innerWidth, maxWidth );
	}

	function getHeight( x ) {
		return ( isSmallViewport ) ? ( getWidth() / x ) : getWidth();
	}

	/**
	 * Gets the variant data from the broader dataset.
	 *
	 * @param prop
	 * @return {{strain_sars_cov_2_unknown : number, strain_sars_cov_2_delta : number, strain_sars_cov_2_kappa : number, strain_sars_cov_2_omicron : number, strain_sars_cov_2_na : number}[]|*}
	 */
	function fetchVariantData() {
		// Filters the data properties to get just the variants.
		const dataPropertyNames = Object.getOwnPropertyNames( data );
		let variantData = {};

		for ( let i = 0; i < dataPropertyNames.length; i++ ) {
			if ( dataPropertyNames[ i ].startsWith( 'strain_sars_cov_2_' ) ) {
				variantData[ dataPropertyNames[ i ] ] = data[ dataPropertyNames[ i ] ];
			}
		}

		variantData[ 'strain_sars_cov_2_omicron' ] = 234;
		variantData[ 'strain_sars_cov_2_kappa' ] = 123;

		return variantData;
	}

	function getTotalVariants() {
		let totalVariants = 0;

		for ( let i = 0; i < orderedVariantKeys.length; i++ ) {
			if ( 'total' !== orderedVariantKeys[ i ] ) {
				totalVariants += variantNumbers[ orderedVariantKeys[ i ] ];
			}
		}

		return totalVariants;
	}

	function assignExistingVariantData() {

		for ( let i = 0; i < orderedImportantVariants.length; i++ ) {
			if ( variantNumbers.hasOwnProperty( orderedImportantVariants[ i ].key ) &&
					0 < variantNumbers[ orderedImportantVariants[ i ].key ] ) {
				orderedVariantKeys.push( orderedImportantVariants[ i ].key );
				orderedVariantColors.push( orderedImportantVariants[ i ].color );
			}
		}
		variantNumbers[ 'total' ] = getTotalVariants();
		orderedVariantKeys.push();
	}

	assignExistingVariantData();

</script>

<style>
    .test-container {
        margin: 0;
    }

    .total-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 75%;
    }

    .total-container > * + * {
        /* margin-left: var(--global--spacing-gap); */
    }

    .variant-container {
        width: 30%;
        font-family: "akkurat", -apple-system, sans-serif;
        font-size: 20px;

    }

    .graphic-container {
        width: 70%;
        margin: -50px 0 20px;
    }

    .title {
        font-size: 40px;
        font-weight: 600;
        text-align: center;
        font-family: "akkurat", -apple-system, sans-serif;

    }

    .icon {
        height: 25px;
        width: 25px;
    }

    #delta-icon {
        background: var(--cov-2-variant--delta);

    }

    #kappa-icon {
        background: var(--cov-2-variant--kappa);

    }

    #omicron-icon {
        background: var(--cov-2-variant--omicron);

    }

    .test-container {
        display: flex;
        margin: 5px;
    }

    .variant-text:first-child {
        margin: 0;
        font-size: 25px;
    }

    .variant-text {
        margin: 0 5px;
    }

    /**
     * Viewport medium size.
     */
    @media only screen and (max-width: 900px) {
        .total-container {
            flex-flow: wrap;
            /* flex: 1; */
            width: 100%;

        }

        .total-container > * {
            /* flex: 1; */
            flex: 0 auto;

        }

        .variant-container {
            /* width: 100%; */
            width: 80%;
            margin: 40px;
        }

        .graphic-container {
            width: 100%;
            height: 220px;
            /* margin-bottom: 10px; */
        }

        .test-container {
            width: 80%;
        }
    }

    :root {
        --cov-2-variant--delta: #750936;
        --cov-2-variant--kappa: #0E8476;
        --cov-2-variant--omicron: #F8B739;
    }
</style>
<div class="total-container">
    <div class="graphic-container">
        <Stacked_Bar_Alternate
                colorscheme={orderedVariantColors}
                credit={''}
                data={[variantNumbers]}
                height={getHeight(1.8)}
                label=""
                orientation={'horizontal'}
                source={''}
                width={getWidth()}
                xVar={"Variants"}
                yGroups={orderedVariantKeys}
                yVar={['total',]}
        />
    </div>
    <div class="variant-container">
        {#if variantNumbers.hasOwnProperty( 'strain_sars_cov_2_delta' )}
            <div class="test-container" id="delta-variants">
                <div class="icon" id="delta-icon"></div>
                <div class="variant-text"><b>Delta:</b> {variantNumbers.strain_sars_cov_2_delta}</div>
            </div>
        {/if}
        {#if variantNumbers.hasOwnProperty( 'strain_sars_cov_2_kappa' )}
            <div class="test-container" id="kappa-variants">
                <div class="icon" id="kappa-icon"></div>
                <div class="variant-text"><b>Kappa:</b> {variantNumbers.strain_sars_cov_2_kappa}</div>
            </div>
        {/if}
        {#if variantNumbers.hasOwnProperty( 'strain_sars_cov_2_omicron' )}
            <div class="test-container" id="omicron-variants">
                <div class="icon" id="omicron-icon"></div>
                <div class="variant-text"><b>Omicron:</b> {variantNumbers.strain_sars_cov_2_omicron}
                </div>
            </div>
        {/if}
    </div>
</div>
<div class="footnote">* Northeastern’s Life Sciences Testing Center analyzes the genome of viral samples that test positive for COVID-19 to determine which strain of the virus is behind a positive test. The lab probes each sample for distinctive markers of known variants of concern: Alpha (B.1.1.7), Beta (B.1.351), Gamma (P.1), Delta (B.1.617.2), Kappa (B.1.617.1), and Omicron (B.1.1.529). Not all positive tests in this report are from variants of concern, so the number of variants reported here will not match the total positive tests above. If a tracked variant of concern is not indicated on the chart above, that variant has not been detected. The data reported here aggregates all positive tests since the Life Sciences Testing Center began monitoring for variants of concern on September 1, 2021.</div>