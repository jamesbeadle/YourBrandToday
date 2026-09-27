<script lang="ts">
	import ConnectSection from '$lib/components/home/ConnectSection.svelte';
	import FacetsSection from '$lib/components/home/FacetsSection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import HowItWorksSection from '$lib/components/home/HowItWorksSection.svelte';
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'Your Brand Today — your whole brand, run for you';
	const pageDescription =
		'We learn your brand, find what is trending today, make short-form video in your voice and your look, publish it, and run the campaigns behind it.';
	const shareImageUrl = `${companyDetails.websiteUrl}/favicon.svg`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={companyDetails.websiteUrl} />
	<meta property="og:image" content={shareImageUrl} />
</svelte:head>

<HeroSection />
<HowItWorksSection />
<FacetsSection />
<ConnectSection />
