<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { userFormSchema } from "./schema";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from "./$types";
	import type { User } from "$lib/server/db";
    import { Button } from "$lib/components/ui/button";
    import { CircleCheckBig, CircleX, UserPlus, Ellipsis, Pencil, Trash } from "lucide-svelte";
    import { Input } from '$lib/components/ui/input';
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";
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
        dataType: 'json',
    });

    const { form: formData, enhance, errors, message } = form;

    let dialogOpen = $state(false);
    let dialogAction = $state("create" as "create" | "update" | "delete" | "reg");
    let regToken = $state(undefined as string | undefined);

    const openUserDelete = (user: User) => {
        dialogAction = "delete";
        clearFormData();
        formData.set(user);
        dialogOpen = true;
    }

    const openUserEdit = (user: User) => {
        dialogAction = "update";
        clearFormData();
        formData.set(user);
        dialogOpen = true;
    }

    const openUserCreate = () => {
        dialogAction = "create";
        clearFormData();
        dialogOpen = true;
    }

    const openRegDialog = (token: string) => {
        dialogAction = "reg";
        regToken = token;
        dialogOpen = true;
    }

    const closeDialog = () => {
        dialogOpen = false;
    }

    const clearFormData = () => {
        formData.set({
            firstname: "",
            lastname: "",
            email: "",
            id: undefined,
        });
    }

    const clearRegToken = () => {
        regToken = undefined;
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

    $effect(() => {
        if ($errors._errors) {
            closeDialog();
            clearFormData();
            clearRegToken();
            $errors._errors.forEach(error => {
                toast.error(error);
            });
        }
        if ($message) {
            if ($message.text) {
                closeDialog();
                toast.success($message.text);
                $message.text = undefined;
            }
            if ($message.token) {
                closeDialog();
                openRegDialog($message.token);
                $message.token = undefined;
            }
        }
    });
</script>

<Card.Root class="flex flex-col w-full">
    <Card.Header class="flex flex-row justify-between align-center">
        <div>
            <Card.Title>{m.adminTitle()}</Card.Title>
            <Card.Description>{m.adminDescription()}</Card.Description>
        </div>
        <Button variant="outline" onclick={() => {openUserCreate()}}>
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
                                <DropdownMenu.Item onclick={() => {openUserDelete(user)}}>
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
        <Dialog.Root
            bind:open={dialogOpen}
        >
            <Dialog.Content>
                <form
                    method="POST"
                    action="?/{dialogAction}"
                    use:enhance
                    class="space-y-4"
                >
                    <input type="hidden" name="id" bind:value={$formData.id} />
                    {#if dialogAction === "reg"}
                    <Dialog.Header>
                        <Dialog.Title class="capitalize">New User Registration</Dialog.Title>
                        <Dialog.Description>
                            <p>User <span class="capitalize">{$formData.firstname} {$formData.lastname} created successfully.</span></p>
                            <p>Copy the token and send it to the user.</p>
                        </Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Footer>
                        <Button onclick={() => {
                            closeDialog();
                            clearRegToken();
                        }}>Close</Button>
                    </Dialog.Footer>
                    {:else if dialogAction === "delete"}
                    <Dialog.Header class="space-y-4" id="user-info">
                        <Dialog.Title class="capitalize">Delete User</Dialog.Title>
                        <Dialog.Description>
                            <p>User {$formData.email} will be deleted.</p>
                            <p>Are you <span class="text-red-700 font-bold underline">ABSOLUTELY</span> sure? This action cannot be undone.</p>
                        </Dialog.Description>
                    </Dialog.Header>
                    <input type="hidden" name="firstname" bind:value={$formData.firstname} />
                    <input type="hidden" name="lastname" bind:value={$formData.lastname} />
                    <input type="hidden" name="email" bind:value={$formData.email} />
                    <Dialog.Footer>
                        <Button type="submit" variant="destructive">Delete</Button>
                    </Dialog.Footer>
                    {:else}
                    <Dialog.Header>
                        <Dialog.Title class="capitalize">{dialogAction} User</Dialog.Title>
                        <Dialog.Description>Description</Dialog.Description>
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
                        <Button type="submit">Save</Button>
                    </Dialog.Footer>
                    {/if}
                </form>
            </Dialog.Content>
        </Dialog.Root>
    </Card.Footer>
</Card.Root>
