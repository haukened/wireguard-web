<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import { Menu } from '$lib/components/custom';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Tooltip from "$lib/components/ui/tooltip";
	
	import '../app.css';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	let { data, children }: { data: LayoutData, children: Snippet} = $props();
</script>

<ModeWatcher/>
<ParaglideJS {i18n}>
	<Toaster richColors/>
	<Tooltip.Provider>
		<div id="main-container" class="flex flex-col w-screen max-w-4xl justify-self-center">
			<Menu user={data.user}/>
			<div id="content-container" class="flex flex-col h-full w-full items-center">
				{@render children()}
			</div>
		</div>
	</Tooltip.Provider>
</ParaglideJS>
