<script lang="ts">
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { userFormSchema, type UserFormSchema } from "./schema";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from "./$types";
	import type { User } from "$lib/server/db";
    import { Button } from "$lib/components/ui/button";
    import { CircleCheckBig, CircleX, UserPlus, Ellipsis, Pencil, Trash } from "lucide-svelte";
    import { Input } from '$lib/components/ui/input';
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Card from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Form from "$lib/components/ui/form";
    import * as m from "$lib/paraglide/messages";
    import * as Table from "$lib/components/ui/table";
    import * as Tooltip from "$lib/components/ui/tooltip";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zodClient(userFormSchema),
        dataType: 'json'
    });

    const { form: formData, enhance } = form;

    let deleteConfirmOpen = $state(false);
    let deleteConfirmUser = $state(null as User | null);

    let dialogOpen = $state(false);
    let dialogAction = $state("add" as "add" | "update");

    const openDeleteConfirm = (user: User) => {
        deleteConfirmUser = user;
        deleteConfirmOpen = true;
    }

    const openUserEdit = (user: User) => {
        dialogAction = "update";
        formData.set(user);
        dialogOpen = true;
    }

    const openUserAdd = () => {
        dialogAction = "add";
        formData.set({
            firstname: "",
            lastname: "",
            email: ""
        });
        dialogOpen = true;
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

<Card.Root class="flex flex-col w-full">
    <Card.Header class="flex flex-row justify-between align-center">
        <div>
            <Card.Title>{m.adminTitle()}</Card.Title>
            <Card.Description>{m.adminDescription()}</Card.Description>
        </div>
        <Button variant="outline" onclick={() => {openUserAdd()}}>
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
                    <Table.Cell class="font-medium"><a class="underline" href="mailto:{user.email}">{user.email}</a></Table.Cell>
                    <Table.Cell class="capitalize hidden md:table-cell">{user.firstname}</Table.Cell>
                    <Table.Cell class="capitalize hidden md:table-cell">{user.lastname}</Table.Cell>
                    <Table.Cell>
                        {#if user.disabled}
                        <Tooltip.Root>
                            <Tooltip.Trigger class="cursor-default">
                                <CircleX color="red"/>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                {m.adminUserDisabled()}
                            </Tooltip.Content>
                        </Tooltip.Root>
                        {:else}
                        <Tooltip.Root>
                            <Tooltip.Trigger class="cursor-default">
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
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Ellipsis />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Item onclick={() => {openUserEdit(user)}}>
                                    <Pencil class="mr-2 size-4"/>
                                    {m.adminUserEdit()}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onclick={() => {openDeleteConfirm(user)}}>
                                    <Trash class="mr-2 size-4"/>
                                    {m.adminUserDelete()}
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
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
                    class="space-y-4"
                >
                <input required type="hidden" name="id" bind:value={deleteConfirmUser} />
                <AlertDialog.Header class="space-y-4">
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
        <!-- This is the user add/edit form-->
        <Dialog.Root
            bind:open={dialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    formData.set({
                        firstname: "",
                        lastname: "",
                        email: ""
                    });
                }
            }}
        >
            <Dialog.Content>
                <form
                    method="POST"
                    action="?/{dialogAction}"
                    use:enhance
                    class="space-y-4" 
                >
                    <Dialog.Header>
                        <Dialog.Title class="capitalize">{dialogAction} User</Dialog.Title>
                        <Dialog.Description>Form Description</Dialog.Description>
                    </Dialog.Header>
                    <Form.Field {form} name="firstname">
                        <Form.Control let:attrs>
                            <Form.Label>{m.firstName()}</Form.Label>
                            <Input placeholder={m.setupFirstNamePlaceholder()} {...attrs} bind:value={$formData.firstname}/>
                        </Form.Control>
                        <Form.FieldErrors/>
                    </Form.Field>
                    <Form.Field {form} name="lastname">
                        <Form.Control let:attrs>
                            <Form.Label>{m.lastName()}</Form.Label>
                            <Input placeholder={m.setupLastNamePlaceholder()} {...attrs} bind:value={$formData.lastname}/>
                        </Form.Control>
                        <Form.FieldErrors/>
                    </Form.Field>
                    <Form.Field {form} name="email">
                        <Form.Control let:attrs>
                            <div class="flex flex-row items-center space-x-4">
                                <Form.Label>{m.email()}</Form.Label>
                                <Form.Description>
                                    {m.setupEmailDescription()}
                                </Form.Description>
                            </div>
                            <Input placeholder={m.setupEmailPlaceholder()} {...attrs} bind:value={$formData.email}/>
                        </Form.Control>
                        <Form.FieldErrors/>
                    </Form.Field>
                    <Dialog.Footer>
                        <Button>Save</Button>
                    </Dialog.Footer>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    </Card.Footer>
</Card.Root>
