<script lang="ts">
	import StoryboardList from './StoryboardList.svelte';
	import { findBrandAction } from '$lib/brand/actions/actionCatalogue';
	import { styleAttributeOf } from '$lib/brand/projections/cssVariables';
	import type { ContentPiece } from '$lib/work/contentPiece';

	let { piece }: { piece: ContentPiece } = $props();

	const invitedLabel = $derived(findBrandAction(piece.invitedAction)?.label ?? null);
</script>

<article class="flex flex-col gap-6">
	<section class="piece" style={styleAttributeOf(piece.brandSnapshot.variables ?? {})}>
		<p class="hook">{piece.hook || 'No hook yet'}</p>
		{#if invitedLabel}<span class="call">{invitedLabel}</span>{/if}
	</section>
	{#if piece.script}
		<section class="flex flex-col gap-2">
			<h2 class="font-display text-lg font-medium">Script</h2>
			<p class="whitespace-pre-line text-chalk/80">{piece.script}</p>
		</section>
	{/if}
	{#if piece.storyboard.length > 0}<StoryboardList shots={piece.storyboard} />{/if}
	{#if piece.caption}
		<section class="flex flex-col gap-2">
			<h2 class="font-display text-lg font-medium">Caption</h2>
			<p class="whitespace-pre-line text-chalk/80">{piece.caption}</p>
		</section>
	{/if}
	{#if piece.publishedUrl}
		<a href={piece.publishedUrl} target="_blank" rel="noopener noreferrer" class="text-go hover:underline">See it published</a>
	{/if}
	{#if piece.brandSnapshot.brief}
		<details class="rounded-2xl border border-hairline p-4">
			<summary class="cursor-pointer text-sm text-chalk/70">The brand as it stood when this was drafted</summary>
			<pre class="mt-3 font-mono text-xs whitespace-pre-wrap text-chalk/70">{piece.brandSnapshot.brief}</pre>
		</details>
	{/if}
</article>

<style>
	.piece {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		min-height: 12rem;
		padding: 1.5rem;
		border-radius: var(--brand-shape-radius, 1rem);
		border: var(--brand-shape-border-width, 1px) var(--brand-shape-border-style, solid) var(--brand-colour-secondary, var(--color-hairline));
		background: var(--brand-colour-primary, var(--color-carriage));
	}
	.hook {
		font-family: var(--brand-type-display-family, var(--font-display));
		font-weight: var(--brand-type-display-weight, 600);
		font-size: 1.5rem;
		color: var(--brand-colour-surface, var(--color-chalk));
	}
	.call {
		align-self: flex-start;
		padding: 0.5rem 1rem;
		border-radius: var(--brand-shape-radius, 999px);
		background: var(--brand-colour-accent, var(--color-signal));
		color: var(--brand-colour-surface, var(--color-night));
	}
</style>
