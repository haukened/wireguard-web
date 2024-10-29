<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import { Menu } from '$lib/components/custom';
	
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher/>
<ParaglideJS {i18n}>
	<Menu/>
	<div id="content-container" class="container flex flex-col h-screen w-screen items-center">
		{@render children()}
	</div>
</ParaglideJS>
