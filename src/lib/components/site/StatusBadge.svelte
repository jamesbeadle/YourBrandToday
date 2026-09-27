<script lang="ts">
	import type { BadgeTone } from './badgeTone';

	let { label, tone = 'quiet' }: { label: string; tone?: BadgeTone } = $props();

	const toneClasses: Record<BadgeTone, string> = {
		go: 'border-go/50 text-go',
		caution: 'border-caution/50 text-caution',
		quiet: 'border-hairline text-chalk/70',
		signal: 'border-signal/60 text-signal'
	};
</script>

<span class={`inline-flex rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap ${toneClasses[tone]}`}>
	{label}
</span>
