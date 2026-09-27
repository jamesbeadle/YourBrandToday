<script lang="ts">
	let { label, value, hint }: { label: string; value: string | number; hint?: string } = $props();
</script>

<div class="flex flex-col gap-1 rounded-2xl border border-hairline bg-carriage p-5">
	<span class="text-xs tracking-wide text-chalk/60 uppercase">{label}</span>
	<span class="font-display text-3xl font-medium">{value}</span>
	{#if hint}
		<span class="text-sm text-chalk/60">{hint}</span>
	{/if}
</div>
