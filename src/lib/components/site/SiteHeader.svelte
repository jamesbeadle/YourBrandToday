<script lang="ts">
	import AccountMenu from './AccountMenu.svelte';
	import BrandWordmark from './BrandWordmark.svelte';
	import MobileMenuButton from './MobileMenuButton.svelte';
	import MobileNavDrawer from './MobileNavDrawer.svelte';
	import { buildMenuGroups } from './siteNavigation';

	let {
		userEmail,
		isAdmin,
		isStaff
	}: {
		userEmail: string | null;
		isAdmin: boolean;
		isStaff: boolean;
	} = $props();

	const isSignedIn = $derived(userEmail !== null);
	const menuGroups = $derived(buildMenuGroups({ isSignedIn, isStaff, isAdmin }));

	let isMobileMenuOpen = $state(false);

	const openMobileMenu = () => (isMobileMenuOpen = true);
	const closeMobileMenu = () => (isMobileMenuOpen = false);
</script>

<header
	class="relative z-40 h-[var(--site-header-height)] border-b border-hairline bg-night print:hidden"
>
	<div class="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6">
		<div class="flex min-w-0 items-center gap-3">
			<a href="/" class="flex shrink-0 items-center">
				<BrandWordmark fontSize={26} />
			</a>
		</div>
		<nav class="hidden shrink-0 items-center gap-6 md:flex">
			{#if !isSignedIn}
				<a
					href="/account/sign-in"
					class="rounded-full bg-signal px-5 py-2 font-display text-sm font-medium text-night
						transition hover:brightness-110"
				>
					Sign in
				</a>
			{/if}
			<AccountMenu {menuGroups} />
		</nav>
		<div class="flex shrink-0 items-center gap-4 md:hidden">
			<MobileMenuButton onOpen={openMobileMenu} />
		</div>
	</div>
</header>

{#if isMobileMenuOpen}
	<MobileNavDrawer {menuGroups} {isSignedIn} onClose={closeMobileMenu} />
{/if}
