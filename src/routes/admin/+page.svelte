<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { userFormSchema } from "./schema";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from "./$types";
	import type { User } from "$lib/server/db";
    import { Button } from "$lib/components/ui/button";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { CircleCheckBig, CircleX, UserPlus, Ellipsis, Pencil, Trash } from "lucide-svelte";
    import { Input } from '$lib/components/ui/input';
    import { Label } from "$lib/components/ui/label/index.js";
    import { toast } from "svelte-sonner";
    import * as Card from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Form from "$lib/components/ui/form";
    import * as m from "$lib/paraglide/messages";
    import * as Table from "$lib/components/ui/table";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import type { Token } from "./message";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zodClient(userFormSchema),
        dataType: 'json',
    });

    const { form: formData, enhance, errors, message } = form;

    let dialogOpen = $state(false);
    let dialogAction = $state("create" as "create" | "update" | "delete" | "reg");
    let disableRegCloseButton = $state(true);
    let actuallyDeleteCheckBox = $state(false);
    let disableDeleteButton = $derived(!actuallyDeleteCheckBox);

    let regToken = $state({
        value: "",
        firstname: "",
        lastname: "",
        email: "",
    } as Token | undefined);

    const generateRegistrationURL = (token: Token | undefined) => {
        if (!token) return "";
        return `${window.location.origin}/register/${token.value}`;
    }

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

    const openRegDialog = (token: Token) => {
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

    const clearCheckbox = () => {
        actuallyDeleteCheckBox = false;
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
            clearCheckbox();
            $errors._errors.forEach(error => {
                toast.error(error);
            });
        }
        if ($message) {
            if ($message.text) {
                closeDialog();
                clearCheckbox();
                toast.success($message.text);
                $message.text = undefined;
            }
            if ($message.token) {
                closeDialog();
                openRegDialog($message.token);
                clearRegToken();
                clearCheckbox();
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
            onOpenChange={(open) => {
                if (!open) {
                    clearFormData();
                    clearRegToken();
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
                    <input type="hidden" name="id" bind:value={$formData.id} />
                    {#if  regToken !== undefined && dialogAction === "reg"}
                    <Dialog.Header>
                        <Dialog.Title class="mb-2">{m.adminNewUser()} - <span class="capitalize">{regToken.firstname} {regToken.lastname}</span> &lt;<span class="lowercase">{regToken.email}</span>&gt;</Dialog.Title>
                        <Dialog.Description class="space-y-1">
                            <p class="font-bold dark:text-white">{m.adminNotShownAgain()}</p>
                            <p>{m.adminNewUserDescription()}</p>
                        </Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Footer>
                        <div class="flex flex-row w-full justify-between">
                            <div class="space-x-2">
                                <Button variant="outline" onclick={() => {
                                    navigator.clipboard.writeText(generateRegistrationURL(regToken)); 
                                    toast.success(m.copiedToClipboard());
                                    disableRegCloseButton = false;
                                }}>{m.copyLink()}</Button>
                                <Button variant="outline" 
                                    href="mailto:{regToken.email}?subject={m.adminEmailSubject()}&body={m.adminEmailBody()}: {generateRegistrationURL(regToken)}"
                                    onclick={() => {disableRegCloseButton = false;}}
                                    >
                                    {m.sendEmail()}
                                </Button>
                            </div>
                            <Button disabled={disableRegCloseButton} onclick={() => {
                                closeDialog();
                                clearRegToken();
                            }}>{m.close()}</Button>
                        </div>
                    </Dialog.Footer>
                    {:else if dialogAction === "delete"}
                    <Dialog.Header class="space-y-2" id="user-info">
                        <Dialog.Title class="capitalize mb-4">{m.adminUserDelete()}</Dialog.Title>
                        <Dialog.Description class="space-y-2">
                            <p>{m.adminUserDeleteDescription({ email: $formData.email})}</p>
                            <p>{m.adminUserDeleteWarning()}</p>
                        </Dialog.Description>
                    </Dialog.Header>
                    <input type="hidden" name="firstname" bind:value={$formData.firstname} />
                    <input type="hidden" name="lastname" bind:value={$formData.lastname} />
                    <input type="hidden" name="email" bind:value={$formData.email} />
                    <Dialog.Footer class="flex flex-row !justify-between">
                        <div class="flex flex-row items-center space-x-2">
                            <Checkbox id="actually-delete" bind:checked={actuallyDeleteCheckBox}/>
                            <Label for="actually-delete">{m.adminConfirmDelete()}</Label>
                        </div>
                        <Button disabled={disableDeleteButton} type="submit" variant="destructive">{m._delete()}</Button>
                    </Dialog.Footer>
                    {:else}
                    <Dialog.Header>
                        <Dialog.Title class="capitalize">{dialogAction} {m.users()}</Dialog.Title>
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
                        <Button type="submit">{m._save()}</Button>
                    </Dialog.Footer>
                    {/if}
                </form>
            </Dialog.Content>
        </Dialog.Root>
    </Card.Footer>
</Card.Root>
