<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { quietButtonClasses } from '$lib/components/site/formStyles';

	let { data } = $props();

	const standing = $derived(
		data.isStaff
			? `${data.isAdmin ? 'an administrator' : 'a member of staff'} — it will be able to do what you can do on every brand we manage`
			: 'a client — it will only ever see the brands you are on'
	);
</script>

<svelte:head>
	<title>Connect {data.clientName} — Your Brand Today</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
	<h1 class="font-display text-3xl font-medium">Connect {data.clientName}</h1>
	<div class="flex flex-col gap-3 rounded-2xl border border-hairline p-6 text-chalk/80">
		<p>
			<strong class="text-chalk">{data.clientName}</strong> is asking to act as you on Your
			Brand Today.
		</p>
		<p>You are signed in as <strong class="text-chalk">{data.email}</strong>, {standing}.</p>
		<p class="text-sm text-chalk/60">
			Everything it does is recorded under your name. You can disconnect it at any time from
			your account.
		</p>
	</div>
	<div class="flex flex-wrap items-center gap-4">
		<form method="POST" action={data.approvePath}>
			<SubmitButton savingLabel="Connecting…">Connect</SubmitButton>
		</form>
		<form method="POST" action={data.refusePath}>
			<SubmitButton class={quietButtonClasses} savingLabel="Cancelling…">Cancel</SubmitButton>
		</form>
	</div>
</div>
