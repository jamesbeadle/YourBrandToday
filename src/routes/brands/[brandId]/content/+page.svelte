<script lang="ts">
	import ContentColumn from '$lib/components/content/ContentColumn.svelte';
	import DraftContentForm from '$lib/components/content/DraftContentForm.svelte';
	import EmptyState from '$lib/components/site/EmptyState.svelte';
	import FormOutcome from '$lib/components/site/FormOutcome.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import { contentStatuses } from '$lib/work/contentPiece';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Content — {data.brand.name}</title>
</svelte:head>

<PageHeader
	title="Content"
	description="Every piece in the works, from idea to published. Each one is made in the brand as it stood when it was drafted, and nothing goes out until it is approved."
/>
<FormOutcome {form} />
{#if data.pieces.length === 0}
	<EmptyState message="Nothing in the works yet. Ask your Claude to draft a piece on a trend worth riding." />
{:else}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each contentStatuses as status (status)}
			<ContentColumn {status} pieces={data.pieces.filter((piece) => piece.status === status)} brandId={data.brand.id} />
		{/each}
	</div>
{/if}
{#if data.canShape}
	<DraftContentForm />
{/if}
