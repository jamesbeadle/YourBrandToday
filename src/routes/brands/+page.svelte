<script lang="ts">
	import BrandCard from '$lib/components/brand/BrandCard.svelte';
	import EmptyState from '$lib/components/site/EmptyState.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import TakeOnBrandForm from '$lib/components/brand/TakeOnBrandForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Brands — Your Brand Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
	<PageHeader
		title="Brands"
		description="Every brand you are on. Open one to see its kit, what is trending for it, the content in the works and how it is performing."
	/>
	{#if data.brands.length === 0}
		<EmptyState
			message="You are not on a brand yet. When we take yours on, it will appear here."
		/>
	{:else}
		<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.brands as brand (brand.id)}
				<li><BrandCard {brand} /></li>
			{/each}
		</ul>
	{/if}
	{#if data.isStaff}
		<TakeOnBrandForm {form} />
	{/if}
</div>
