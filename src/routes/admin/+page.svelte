<script lang="ts">
	import type { PageData } from "./$types";
    import { Button } from "$lib/components/ui/button";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import * as m from "$lib/paraglide/messages";
    import { CirclePower, CircleCheckBig, CircleX, Pencil, Trash, UserPlus } from "lucide-svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import type { User } from "$lib/server/db";

    let { data }: {data: PageData} = $props();

    let deleteConfirmOpen = $state(false);
    let deleteConfirmUser = $state(null as User | null);

    const openDeleteConfirm = (user: User) => {
        deleteConfirmUser = user;
        deleteConfirmOpen = true;
    }
    
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone
    });
</script>

<Card.Root>
    <Card.Header class="flex flex-row justify-between">
        <div>
            <Card.Title>{m.adminTitle()}</Card.Title>
            <Card.Description>{m.adminDescription()}</Card.Description>
        </div>
        <Button variant="outline">
            <UserPlus class="mr-2 size-5"/>
            {m.adminUserCreate()}
        </Button>
    </Card.Header>
    <Card.Content>
        <Table.Root>
            <Table.Header>
                <Table.Row id="table-header">
                    <Table.Head>{m.email()}</Table.Head>
                    <Table.Head class="hidden md:table-cell">{m.firstName()}</Table.Head>
                    <Table.Head class="hidden md:table-cell">{m.lastName()}</Table.Head>
                    <Table.Head>{m.status()}</Table.Head>
                    <Table.Head>{m.lastLogin()}</Table.Head>
                    <Table.Head>{m.adminActions()}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#if data.users}
                {#each data.users as user}
                <Table.Row id='user-{user.id}'>
                    <Table.Cell class="font-medium">{user.email}</Table.Cell>
                    <Table.Cell class="capitalize hidden md:table-cell">{user.firstname}</Table.Cell>
                    <Table.Cell class="capitalize hidden md:table-cell">{user.lastname}</Table.Cell>
                    <Table.Cell>
                        {#if user.disabled}
                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <CircleX color="red"/>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                {m.adminUserDisabled()}
                            </Tooltip.Content>
                        </Tooltip.Root>
                        {:else}
                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <CircleCheckBig color="green"/>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                {m.adminUserEnabled()}
                            </Tooltip.Content>
                        </Tooltip.Root>
                        {/if}
                    </Table.Cell>
                    <Table.Cell>{user.last_login ? dateFormatter.format(user.last_login) : "Never"}</Table.Cell>
                    <Table.Cell class="flex space-x-2 justify-center h-full">
                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <Pencil />
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                {m.adminUserEdit()}
                            </Tooltip.Content>
                        </Tooltip.Root>
                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <CirclePower />
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                {m.adminUserToggle()}
                            </Tooltip.Content>
                        </Tooltip.Root>
                        <Tooltip.Root>
                            <Tooltip.Trigger >
                                <Trash onclick={() => {openDeleteConfirm(user)}} />
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                {m.adminUserDelete()}
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </Table.Cell>
                </Table.Row>
              {/each}
              {/if}
            </Table.Body>
        </Table.Root>
    </Card.Content>
    <Card.Footer>
        <!-- The alert doesn't have to be here, its just a decent place to put it
        that makes the JSX happy and i don't have to use fragment or snippet  -->
        <AlertDialog.Root 
            bind:open={deleteConfirmOpen}
            onOpenChange={(open) => {
                if (!open) {
                    deleteConfirmUser = null;
                }
            }}
            >
            <AlertDialog.Content>
                <form
                    method="POST"
                    action="?/delete"
                    onsubmit={() => {
                        console.log("submitting delete form");
                        deleteConfirmOpen = false;
                    }}
                >
                <input required type="hidden" name="id" bind:value={deleteConfirmUser} />
                <AlertDialog.Header>
                    <AlertDialog.Title>
                        Are you absolutely sure?        
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                        This action cannot be undone. <br/>This will permanently delete the user <span class="font-bold text-red-700">{deleteConfirmUser?.email}</span>
                    </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.Cancel>
                        Cancel
                    </AlertDialog.Cancel>
                    <Button type="submit" variant="destructive">Delete</Button>
                </AlertDialog.Footer>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    </Card.Footer>
</Card.Root>
