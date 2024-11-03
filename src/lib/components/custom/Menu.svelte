<script lang="ts">
    import ModeSwitch from "./ModeSwitch.svelte";
    import GitHubHover from "./GitHubHover.svelte";
    import UserMenu from "./UserMenu.svelte";
    import { Emblem } from "../logos";
	import type { UserInfo } from "$lib/types";

    export let user: UserInfo | null;
</script>

<div class="container flex flex-row items-center justify-between space-y-2 py-4">
    <div id="menu-start" class="flex flex-row items-center">
        <a href="/" class="flex flex-row items-center space-x-2">
            <Emblem/>
            <h1 class="text-xl font-semibold">WireGuard Web</h1>
        </a>
    </div>
    <div id="menu-end" class="flex flex-row items-center space-x-4">
        <GitHubHover />
        <ModeSwitch />
        <UserMenu {user}/>
    </div>
</div>