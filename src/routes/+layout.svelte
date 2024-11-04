<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import { Menu } from '$lib/components/custom';
	import { Toaster } from '$lib/components/ui/sonner';
	
	import '../app.css';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	let { data, children }: { data: LayoutData, children: Snippet} = $props();
</script>

<ModeWatcher/>
<ParaglideJS {i18n}>
	<Toaster richColors/>
	<Menu user={data.user}/>
	<div id="content-container" class="container flex flex-col h-screen w-screen items-center">
		{@render children()}
	</div>
</ParaglideJS>
