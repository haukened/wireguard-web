<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
    import { zodClient } from "sveltekit-superforms/adapters";
    import * as Form from "$lib/components/ui/form";
    import { setupFormSchema, type SetupFormSchema } from './schema';
    import * as m from '$lib/paraglide/messages.js';

    export let data: SuperValidated<Infer<SetupFormSchema>>;

    const form = superForm(data, {
        validators: zodClient(setupFormSchema),
        dataType: 'json'
    });

    const { form: formData, enhance } = form;
</script>

<Card.Root class="w-96 max-w-full">
    <Card.Header>
      <Card.Title>{m.setupWelcome()}</Card.Title>
      <Card.Description>{m.setupDescription()}</Card.Description>
    </Card.Header>
    <Card.Content>
        <form method="POST" use:enhance id="setup-form" class="space-y-4">
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
            <Form.Field {form} name="password">
                <Form.Control let:attrs>
                    <Form.Label>{m.password()}</Form.Label>
                    <Input type='password' placeholder={m.setupPasswordPlaceholder()} {...attrs} bind:value={$formData.password}/>
                </Form.Control>
                <Form.FieldErrors/>
            </Form.Field>
            <div class="flex justify-end">
                <Button type="submit" variant="default">{m.deploy()}</Button>
            </div>
        </form>
    </Card.Content>
  </Card.Root>