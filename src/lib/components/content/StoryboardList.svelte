<script lang="ts">
	import type { StoryboardShot } from '$lib/work/contentPiece';

	let { shots }: { shots: StoryboardShot[] } = $props();

	const totalSeconds = $derived(shots.reduce((sum, shot) => sum + shot.seconds, 0));
</script>

<section class="flex flex-col gap-2">
	<h2 class="font-display text-lg font-medium">Storyboard · {totalSeconds}s</h2>
	<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
		{#each shots as shot, index (index)}
			<li class="flex gap-4 p-3 text-sm">
				<span class="w-12 shrink-0 font-mono text-chalk/50">{shot.seconds}s</span>
				<span class="flex flex-col gap-1">
					<span>{shot.description}</span>
					{#if shot.onScreenText}<span class="text-chalk/60">On screen: “{shot.onScreenText}”</span>{/if}
				</span>
			</li>
		{/each}
	</ol>
</section>
