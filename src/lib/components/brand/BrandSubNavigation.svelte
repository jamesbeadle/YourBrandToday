<script lang="ts">
	import { page } from '$app/state';

	let { brandId }: { brandId: string } = $props();

	const sections = [
		{ path: '', label: 'Overview' },
		{ path: '/kit', label: 'Brand kit' },
		{ path: '/trends', label: 'Trends' },
		{ path: '/content', label: 'Content' },
		{ path: '/campaigns', label: 'Campaigns' },
		{ path: '/performance', label: 'Performance' }
	];

	const base = $derived(`/brands/${brandId}`);

	function isCurrent(path: string): boolean {
		const href = `${base}${path}`;
		if (path === '') return page.url.pathname === href;
		return page.url.pathname.startsWith(href);
	}
</script>

<nav class="scrollbar-hidden -mb-px flex gap-6 overflow-x-auto">
	{#each sections as section (section.path)}
		<a
			href={`${base}${section.path}`}
			aria-current={isCurrent(section.path) ? 'page' : undefined}
			class={[
				'border-b-2 pb-3 text-sm whitespace-nowrap transition',
				isCurrent(section.path) ? 'border-go text-chalk' : 'border-transparent text-chalk/60 hover:text-chalk'
			]}
		>
			{section.label}
		</a>
	{/each}
</nav>
