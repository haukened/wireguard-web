<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as m from '$lib/paraglide/messages.js';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import * as Form from "$lib/components/ui/form";
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { passwordFormSchema, type PasswordFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from "./$types";
    import { toast } from "svelte-sonner";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zodClient(passwordFormSchema),
        dataType: 'json',
        clearOnSubmit: 'errors-and-message',
    })

    const { form: formData, enhance, errors, message  } = form;

    $effect(() => {
        if ($errors._errors) {
            $errors._errors.forEach(error => {
                toast.error(error);
            });
        }
        if ($message) {
            toast.success($message);
        }
    });
</script>

<Card.Root class="w-96 max-w-full">
    <Card.Header>
        <Card.Title>{m.password()}</Card.Title>
        <Card.Description>{m.passwordChangeDescription()}</Card.Description>
    </Card.Header>
    <Card.Content>
        <form method="POST" use:enhance id="password-form" class="space-y-4">
            <Form.Field {form} name="password">
                <Form.Control let:attrs>
                    <Form.Label>{m.passwordNew()}</Form.Label>
                    <Input type="password" placeholder={m.passwordNew()} {...attrs} bind:value={$formData.password}/>
                </Form.Control>
                <Form.FieldErrors/>
            </Form.Field>
            <Form.Field {form} name="confirm">
                <Form.Control let:attrs>
                    <Form.Label>{m.passwordConfirm()}</Form.Label>
                    <Input type="password" placeholder={m.passwordConfirm()} {...attrs} bind:value={$formData.confirm}/>
                </Form.Control>
                <Form.FieldErrors/>
            </Form.Field>
            <div class="flex justify-end">
                <Button type="submit" variant="default">{m.save()}</Button>
            </div>
        </form>
    </Card.Content>
</Card.Root>