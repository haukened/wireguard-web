<script lang="ts">
    import ModeSwitch from "./ModeSwitch.svelte";
    import GitHubHover from "./GitHubHover.svelte";
    import { Emblem } from "../logos";
    import { goto } from "$app/navigation";
	import type { UserInfo } from "$lib/types";
    import * as Avatar from "$lib/components/ui/avatar/";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as m from "$lib/paraglide/messages";
	import Button from "../ui/button/button.svelte";
	import Login from "../logos/Login.svelte";

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
        {#if user}
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]} variant="ghost" size="icon" class="rounded-full">
                <Avatar.Root>
                    {#if user.gravatar}
                    <Avatar.Image src={user.gravatar} alt={user.firstname + " " + user.lastname} />
                    {/if}
                    <Avatar.Fallback>{user.firstname?.charAt(0).toUpperCase() + user.lastname?.charAt(0).toUpperCase()}</Avatar.Fallback>
                </Avatar.Root>
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                <DropdownMenu.Item on:click={() => goto('/profile')}>{m.profile()}</DropdownMenu.Item>
                <DropdownMenu.Item on:click={() => goto('/settings')}>{m.settings()}</DropdownMenu.Item>
                <DropdownMenu.Item on:click={() => {
                    user = null;
                    goto('/logout');
                }}>{m.logout()}</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
        {:else}
        <Login/>
        {/if}
    </div>
</div>