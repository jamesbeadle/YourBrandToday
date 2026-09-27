<script lang="ts">
	import FormErrorNote from './FormErrorNote.svelte';

	let { form }: { form: { message?: string; problem?: string } | null | undefined } = $props();
</script>

{#if form?.message}
	<p role="status" class="rounded-xl border border-go/50 bg-go/10 px-4 py-3 text-sm text-go">
		{form.message}
	</p>
{/if}
<FormErrorNote message={form?.problem ?? null} />
