<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
    import { zodClient } from "sveltekit-superforms/adapters";
    import * as Form from "$lib/components/ui/form";
    import { loginFormSchema, type LoginFormSchema } from './schema';
    import * as m from '$lib/paraglide/messages.js';
	import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";

    //export let data: SuperValidated<Infer<LoginFormSchema>>;

    let { data }: { data: SuperValidated<Infer<LoginFormSchema>> } = $props();

    const form = superForm(data, {
        validators: zodClient(loginFormSchema),
        dataType: 'json'
    });

    const { form: formData, errors, enhance } = form;

    $effect(() => {
        if ($errors._errors) {
            $errors._errors.forEach(error => {
                toast.error(error);
            });
        }
    });
</script>

<Card.Root class="w-96 max-w-full">
    <Card.Header>
      <Card.Title>{m.login()}</Card.Title>
      <Card.Description>{m.loginDescription()}</Card.Description>
    </Card.Header>
    <Card.Content>
        <form method="POST" use:enhance id="setup-form" class="space-y-4">
            <Form.Field {form} name="email">
                <Form.Control let:attrs>
                    <Form.Label>{m.emailAddress()}</Form.Label>
                    <Input placeholder={m.emailDescription()} {...attrs} bind:value={$formData.email}/>
                </Form.Control>
            </Form.Field>
            <Form.Field {form} name="password">
                <Form.Control let:attrs>
                    <Form.Label>{m.password()}</Form.Label>
                    <Input type='password' placeholder={m.passwordDescription()} {...attrs} bind:value={$formData.password}/>
                </Form.Control>
            </Form.Field>
            <div class="flex justify-end">
                <Button type="submit" variant="default">{m.login()}</Button>
            </div>
        </form>
    </Card.Content>
  </Card.Root>