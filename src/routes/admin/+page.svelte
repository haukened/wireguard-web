<script lang="ts">
	import type { PageData } from "./$types";
    import { Button } from "$lib/components/ui/button";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import * as m from "$lib/paraglide/messages";
    import { CirclePower, CircleCheckBig, CircleX, Pencil, Trash, UserPlus } from "lucide-svelte";

    let { data }: {data: PageData} = $props();
    
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
                <Table.Row>
                    <Table.Head class="w-[100px]">{m.username()}</Table.Head>
                    <Table.Head class="hidden md:table-cell">{m.firstName()}</Table.Head>
                    <Table.Head class="hidden md:table-cell">{m.lastName()}</Table.Head>
                    <Table.Head class="hidden sm:table-cell">{m.email()}</Table.Head>
                    <Table.Head>{m.status()}</Table.Head>
                    <Table.Head>{m.lastLogin()}</Table.Head>
                    <Table.Head>{m.adminActions()}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#if data.users}
                {#each data.users as user, i (i)}
                <Table.Row>
                    <Table.Cell class="font-medium">{user.username}</Table.Cell>
                    <Table.Cell class="capitalize hidden md:table-cell">{user.firstname}</Table.Cell>
                    <Table.Cell class="capitalize hidden md:table-cell">{user.lastname}</Table.Cell>
                    <Table.Cell class="hidden sm:table-cell"><a class="underline lowercase" href="mailto:{user.email}">{user.email}</a></Table.Cell>
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
                            <Tooltip.Trigger>
                                <Trash />
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
</Card.Root>
