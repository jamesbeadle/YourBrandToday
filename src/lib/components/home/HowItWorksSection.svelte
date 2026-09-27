<script lang="ts">
	import { howItWorksSteps } from '$lib/data/howItWorksSteps';
</script>

<section class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
	<h2 class="font-display text-3xl font-medium">How it works</h2>
	<ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each howItWorksSteps as step, index (step.title)}
			<li class="flex flex-col gap-2 rounded-2xl border border-hairline bg-carriage p-5">
				<span class="font-mono text-sm text-go">{String(index + 1).padStart(2, '0')}</span>
				<h3 class="font-display text-lg font-medium">{step.title}</h3>
				<p class="text-sm text-chalk/70">{step.description}</p>
			</li>
		{/each}
	</ol>
</section>
