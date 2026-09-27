<script lang="ts">
	import { resolvedValueOf, type ResolvedBrand } from '$lib/brand/resolution/resolvedBrand';
	import { styleAttributeOf } from '$lib/brand/projections/cssVariables';
	import { describeTraitValue } from '$lib/brand/values/traitValue';

	let {
		brandName,
		resolved,
		variables
	}: { brandName: string; resolved: ResolvedBrand; variables: Record<string, string> } = $props();

	const textOf = (traitKey: string, fallback: string) => {
		const value = resolvedValueOf(resolved, traitKey);
		return value === null ? fallback : describeTraitValue(value);
	};
</script>

<section class="brand-preview" style={styleAttributeOf(variables)} aria-label="The brand, previewed">
	<div class="frame">
		<p class="hook">{textOf('voice.greeting', 'Your hook goes here')}</p>
		<span class="caption">{textOf('voice.tone', 'Captions arrive in the brand’s own style')}</span>
	</div>
	<div class="card">
		<p class="eyebrow">{brandName} · {resolved.medium.label}</p>
		<p class="headline">{textOf('audience.description', 'Who the brand is for')}</p>
		<p class="body">{textOf('voice.signOff', 'Every colour, radius and border width here is the brand’s own.')}</p>
		<span class="call">{textOf('voice.wordsToUse', 'Call to action')}</span>
	</div>
</section>

<style>
	.brand-preview {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: minmax(0, 14rem) minmax(0, 1fr);
		padding: 1.5rem;
		border-radius: 1rem;
		background: var(--brand-colour-surface, var(--color-paper));
		color: var(--brand-colour-ink, var(--color-ink));
		font-family: var(--brand-type-body-family, var(--font-sans));
	}
	@media (max-width: 40rem) {
		.brand-preview { grid-template-columns: minmax(0, 1fr); }
	}
	.frame {
		aspect-ratio: 9 / 16;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 1rem;
		border-radius: var(--brand-shape-radius, 0.75rem);
		border: var(--brand-shape-border-width, 1px) var(--brand-shape-border-style, solid) var(--brand-colour-primary, currentColor);
		background: var(--brand-colour-primary, var(--color-slate));
	}
	.hook {
		font-family: var(--brand-type-display-family, var(--font-display));
		font-weight: var(--brand-type-display-weight, 600);
		color: var(--brand-colour-surface, white);
		font-size: 1.25rem;
	}
	.caption {
		align-self: flex-start;
		padding: 0.25rem 0.5rem;
		font-size: var(--brand-type-caption-size, 0.875rem);
		color: var(--brand-colour-caption-text, white);
		background: var(--brand-colour-caption-background, black);
		border-radius: calc(var(--brand-shape-radius, 0.5rem) / 2);
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: var(--brand-space-unit, 0.75rem);
		padding: calc(var(--brand-space-unit, 0.75rem) * 2);
		border-radius: var(--brand-shape-radius, 0.75rem);
		border: var(--brand-shape-border-width, 1px) var(--brand-shape-border-style, solid) var(--brand-colour-secondary, currentColor);
		line-height: var(--brand-type-line-height, 1.5);
	}
	.eyebrow { font-size: 0.75rem; color: var(--brand-colour-muted-ink, currentColor); text-transform: uppercase; letter-spacing: 0.08em; }
	.headline { font-family: var(--brand-type-display-family, var(--font-display)); font-weight: var(--brand-type-display-weight, 600); font-size: 1.5rem; }
	.body { font-weight: var(--brand-type-body-weight, 400); color: var(--brand-colour-muted-ink, currentColor); }
	.call {
		align-self: flex-start;
		padding: 0.5rem 1rem;
		border-radius: var(--brand-shape-radius, 999px);
		background: var(--brand-colour-accent, var(--color-signal));
		color: var(--brand-colour-surface, white);
		transition: transform var(--brand-timing-standard, 200ms) var(--brand-easing-standard, ease);
	}
	.call:hover { transform: translateY(-2px); }
</style>
