<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import * as Avatar from '$lib/components/ui/avatar';
    import * as m from '$lib/paraglide/messages';
    import type { UserInfo } from '$lib/types';
    import { goto } from "$app/navigation";
    import { LogOut, User, Users, RectangleEllipsis, Sun, Moon, House } from 'lucide-svelte';
    import { toggleMode } from 'mode-watcher';

    export let user: UserInfo | null;
</script>

{#if user}
<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Avatar.Root class="h-10 w-10">
            <Avatar.Image src={user.gravatar ? user.gravatar : "https://gravatar.com/avatar/0000?d=404"} alt={user.firstname + " " + user.lastname} />
            <Avatar.Fallback>{user.firstname?.charAt(0).toUpperCase() + user.lastname?.charAt(0).toUpperCase()}</Avatar.Fallback>
        </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
        <DropdownMenu.Item>
            <House class="mr-2 size-4" />
            {m.home()}
        </DropdownMenu.Item>
        <DropdownMenu.Separator/>
        <DropdownMenu.Group>
            <DropdownMenu.GroupHeading>{m.myAccount()}</DropdownMenu.GroupHeading>
            <DropdownMenu.Item onclick={() => goto('/profile')}>
                <User class="mr-2 size-4"/>
                {m.profile()}
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => goto('/password')}>
                <RectangleEllipsis class="mr-2 size-4"/>
                {m.password()}
            </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator/>
        <DropdownMenu.Group>
            <DropdownMenu.GroupHeading>{m.settings()}</DropdownMenu.GroupHeading>
            <DropdownMenu.Item onclick={() => toggleMode()}>
                <Sun class="mr-2 size-4 transition-all dark:-rotate-90 dark:hidden"/>
                <Moon class="mr-2 size-4 transition-all dark:rotate-0 hidden dark:block"/>
                {m.toggleTheme()}
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => goto('/users')}>
                <Users class="mr-2 size-4"/>
                {m.users()}
            </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator/>
        <DropdownMenu.Item onclick={() => {
            user = null;
            goto('/logout')    
        }}>
            <LogOut class="mr-2 size-4"/>
            {m.logout()}
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
{/if}