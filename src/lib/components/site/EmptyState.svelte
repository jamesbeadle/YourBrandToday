<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div class="rounded-2xl border-2 border-dashed border-hairline p-12 text-center">
	<p class="mx-auto max-w-prose text-chalk/60">{message}</p>
</div>
