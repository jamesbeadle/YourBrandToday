<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, children, class: extraClasses = '' }: { label: string; children: Snippet; class?: string } =
		$props();
</script>

<label class={`flex flex-col gap-2 text-sm text-chalk/70 ${extraClasses}`}>
	{label}
	{@render children()}
</label>
