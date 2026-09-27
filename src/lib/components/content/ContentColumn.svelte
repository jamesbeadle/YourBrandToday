<script lang="ts">
	import { contentStatusLabels, type ContentStatus, type ContentSummary } from '$lib/work/contentPiece';

	let { status, pieces, brandId }: { status: ContentStatus; pieces: ContentSummary[]; brandId: string } = $props();
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-hairline p-4">
	<h2 class="flex justify-between font-display font-medium">
		{contentStatusLabels[status]}
		<span class="text-chalk/50">{pieces.length}</span>
	</h2>
	<ul class="flex flex-col gap-2">
		{#each pieces as piece (piece.id)}
			<li>
				<a
					href={`/brands/${brandId}/content/${piece.id}`}
					class="flex flex-col gap-1 rounded-xl bg-carriage p-3 transition hover:bg-hairline"
				>
					<span class="text-sm font-medium">{piece.title}</span>
					<span class="text-xs text-chalk/50">
						{piece.mediumPath}{piece.scheduledFor ? ` · ${new Date(piece.scheduledFor).toLocaleString('en-GB')}` : ''}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>
