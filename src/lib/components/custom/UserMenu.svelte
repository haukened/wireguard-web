<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import * as Avatar from '$lib/components/ui/avatar';
    import * as m from '$lib/paraglide/messages';
    import type { UserInfo } from '$lib/types';
    import { goto } from "$app/navigation";
    import { Login } from '$lib/components/logos';

    export let user: UserInfo | null;
</script>

{#if user}
<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Avatar.Root class="h-10 w-10">
            {#if user.gravatar}
            <Avatar.Image src={user.gravatar} alt={user.firstname + " " + user.lastname} />
            {/if}
            <Avatar.Fallback>{user.firstname?.charAt(0).toUpperCase() + user.lastname?.charAt(0).toUpperCase()}</Avatar.Fallback>
        </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
        <DropdownMenu.Item onclick={() => goto('/profile')}>{m.profile()}</DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => goto('/settings')}>{m.settings()}</DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => {
            user = null;
            goto('/logout')    
        }}>{m.logout()}</DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
{:else}
<Login/>
{/if}