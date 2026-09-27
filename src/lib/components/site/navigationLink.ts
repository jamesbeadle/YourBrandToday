export type NavigationLink = {
	href: string;
	label: string;
};

export type NavigationGroup = {
	label: string;
	links: NavigationLink[];
};
