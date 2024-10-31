<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
    import { zodClient } from "sveltekit-superforms/adapters";
    import * as Form from "$lib/components/ui/form";
    import { loginFormSchema, type LoginFormSchema } from './schema';
    import * as m from '$lib/paraglide/messages.js';

    export let data: SuperValidated<Infer<LoginFormSchema>>;

    const form = superForm(data, {
        validators: zodClient(loginFormSchema),
        dataType: 'json'
    });

    const { form: formData, enhance } = form;
</script>

<Card.Root class="w-96 max-w-full">
    <Card.Header>
      <Card.Title>{m.login()}</Card.Title>
      <Card.Description>{m.loginDescription()}</Card.Description>
    </Card.Header>
    <Card.Content>
        <form method="POST" use:enhance id="setup-form" class="space-y-4">
            <Form.Field {form} name="username">
                <Form.Control let:attrs>
                    <Form.Label>{m.username()}</Form.Label>
                    <Input placeholder={m.usernameDescription()} {...attrs} bind:value={$formData.username}/>
                </Form.Control>
                <Form.FieldErrors/>
            </Form.Field>
            <Form.Field {form} name="password">
                <Form.Control let:attrs>
                    <Form.Label>{m.password()}</Form.Label>
                    <Input type='password' placeholder={m.passwordDescription()} {...attrs} bind:value={$formData.password}/>
                </Form.Control>
                <Form.FieldErrors/>
            </Form.Field>
            <div class="flex justify-end">
                <Button type="submit" variant="default">{m.login()}</Button>
            </div>
        </form>
    </Card.Content>
  </Card.Root>