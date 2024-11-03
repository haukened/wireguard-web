<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import * as Form from "$lib/components/ui/form";
    import * as m from '$lib/paraglide/messages.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { passwordFormSchema, type PasswordFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';

    export let data: SuperValidated<Infer<PasswordFormSchema>>;

    const form = superForm(data, {
        validators: zodClient(passwordFormSchema),
        dataType: 'json'
    })

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance id="password-form" class="space-y-4">
    <Form.Field {form} name="password">
        <Form.Control let:attrs>
            <Form.Label>{m.passwordNew()}</Form.Label>
            <Input placeholder={m.passwordNew()} {...attrs} bind:value={$formData.password}/>
        </Form.Control>
        <Form.FieldErrors/>
    </Form.Field>
    <Form.Field {form} name="confirm">
        <Form.Control let:attrs>
            <Form.Label>{m.passwordConfirm()}</Form.Label>
            <Input placeholder={m.passwordConfirm()} {...attrs} bind:value={$formData.confirm}/>
        </Form.Control>
        <Form.FieldErrors/>
    </Form.Field>
    <div class="flex justify-end">
        <Button type="submit" variant="default">{m.save()}</Button>
    </div>
</form>