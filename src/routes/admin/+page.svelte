<script lang="ts">
	import AdminUserRow from '$lib/components/admin/AdminUserRow.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Admin — Your Brand Today</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Admin</h1>
		<p class="text-chalk/70">
			Everyone with an account here, who is on our staff, and the controls to restrict access or
			delete an account.
		</p>
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">{form.message}</p>
	{/if}
	<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
		{#each data.users as user (user.email)}
			<AdminUserRow {user} />
		{/each}
	</ul>
</div>
