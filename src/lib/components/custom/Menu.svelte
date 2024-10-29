<script lang="ts">
    import ModeSwitch from "./ModeSwitch.svelte";
    import GitHubHover from "./GitHubHover.svelte";
    import { Emblem } from "../logos";
</script>

<div class="container flex flex-row items-center justify-between space-y-2 py-4">
    <div id="menu-start" class="flex flex-row items-center">
        <Emblem/>
        <h1 class="text-xl font-semibold">WireGuard Web</h1>
    </div>
    <div id="menu-end" class="flex flex-row items-center space-x-4">
        <GitHubHover />
        <ModeSwitch />
    </div>
</div>