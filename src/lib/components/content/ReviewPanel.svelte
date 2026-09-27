<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import StatusBadge from '$lib/components/site/StatusBadge.svelte';
	import { inputClasses, panelClasses, primaryButtonClasses, quietButtonClasses } from '$lib/components/site/formStyles';
	import type { ContentReview } from '$lib/server/content/getContent';

	let { reviews, isAwaitingApproval }: { reviews: ContentReview[]; isAwaitingApproval: boolean } = $props();

	const verdictLabels: Record<string, string> = {
		comment: 'comment',
		changes_requested: 'changes asked for',
		approved: 'approved'
	};
</script>

<section class={panelClasses}>
	<h2 class="font-display text-lg font-medium">Reviews</h2>
	{#each reviews as review (review.createdAt)}
		<div class="flex flex-col gap-1 text-sm">
			<StatusBadge label={verdictLabels[review.verdict] ?? review.verdict} tone={review.verdict === 'approved' ? 'go' : 'quiet'} />
			{#if review.body}<p class="text-chalk/80">{review.body}</p>{/if}
		</div>
	{:else}
		<p class="text-sm text-chalk/60">No reviews yet.</p>
	{/each}
	<CommandForm action="?/review" class="flex flex-col gap-3">
		<textarea name="body" rows="3" maxlength="2000" placeholder="What do you think?" class={inputClasses}></textarea>
		<div class="flex flex-wrap gap-2">
			{#if isAwaitingApproval}
				<button type="submit" name="verdict" value="approved" class={primaryButtonClasses}>Approve</button>
			{/if}
			<button type="submit" name="verdict" value="changes_requested" class={quietButtonClasses}>Ask for changes</button>
			<button type="submit" name="verdict" value="comment" class={quietButtonClasses}>Comment</button>
		</div>
	</CommandForm>
</section>
