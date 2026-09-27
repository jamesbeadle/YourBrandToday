<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import StatusBadge from '$lib/components/site/StatusBadge.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';
	import type { BrandMember } from '$lib/server/brands/getBrand';

	let { members, isStaff }: { members: BrandMember[]; isStaff: boolean } = $props();
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline p-5">
	<h2 class="font-display text-xl font-medium">People on the brand</h2>
	{#if members.length === 0}
		<p class="text-sm text-chalk/60">Nobody from the client yet.</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline">
			{#each members as member (member.accountId)}
				<li class="flex items-center justify-between py-2 text-sm">
					<span>{member.email}</span>
					<StatusBadge label={member.role} />
				</li>
			{/each}
		</ul>
	{/if}
	{#if isStaff}
		<CommandForm action="?/addMember" class="flex flex-wrap items-end gap-3">
			<input name="email" type="email" required placeholder="their@email" class={`${inputClasses} flex-1`} />
			<select name="role" class={selectClasses}>
				<option value="owner">owner</option>
				<option value="manager">manager</option>
				<option value="viewer">viewer</option>
			</select>
			<SubmitButton>Add</SubmitButton>
		</CommandForm>
	{/if}
</section>
