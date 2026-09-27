<script lang="ts">
	import { formatPounds } from '$lib/data/formatPounds';
	import type { MediumPerformance } from '$lib/server/performance/performanceSummary';

	let { rows }: { rows: MediumPerformance[] } = $props();

	const secondsInAnHour = 3600;
	const count = (figure: number) => figure.toLocaleString('en-GB');
</script>

<div class="overflow-x-auto rounded-2xl border border-hairline">
	<table class="w-full text-sm">
		<thead class="text-left text-chalk/60">
			<tr>
				<th class="p-3 font-normal">Medium</th>
				<th class="p-3 text-right font-normal">Views</th>
				<th class="p-3 text-right font-normal">Hours watched</th>
				<th class="p-3 text-right font-normal">Engagements</th>
				<th class="p-3 text-right font-normal">Clicks</th>
				<th class="p-3 text-right font-normal">Conversions</th>
				<th class="p-3 text-right font-normal">Spent</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-hairline">
			{#each rows as row (row.mediumPath)}
				<tr>
					<td class="p-3">{row.mediumPath}</td>
					<td class="p-3 text-right">{count(row.views)}</td>
					<td class="p-3 text-right">{count(Math.round(row.watchSeconds / secondsInAnHour))}</td>
					<td class="p-3 text-right">{count(row.engagements)}</td>
					<td class="p-3 text-right">{count(row.clicks)}</td>
					<td class="p-3 text-right">{count(row.conversions)}</td>
					<td class="p-3 text-right">{formatPounds(row.spendPence)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
