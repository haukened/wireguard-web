<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import * as Form from "$lib/components/ui/form";
    import * as m from '$lib/paraglide/messages.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { profileFormSchema, type ProfileFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';

    export let data: SuperValidated<Infer<ProfileFormSchema>>;

    const form = superForm(data, {
        validators: zodClient(profileFormSchema),
        dataType: 'json'
    })

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance id="profile-form" class="space-y-4">
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
                    Optional, used for gravatar only.
                </Form.Description>
            </div>
            <Input placeholder={m.setupEmailPlaceholder()} {...attrs} bind:value={$formData.email}/>
        </Form.Control>
        <Form.FieldErrors/>
    </Form.Field>
    <div class="flex justify-end">
        <Button type="submit" variant="default">{m.save()}</Button>
    </div>
</form>