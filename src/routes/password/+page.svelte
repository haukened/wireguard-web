<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as m from '$lib/paraglide/messages.js';
    import Separator from "$lib/components/ui/separator/separator.svelte";
	import PasswordForm from "./passwordForm.svelte";

    export let data;
</script>

<Card.Root class="w-96 max-w-full">
    <Card.Header>
        <Card.Title>{m.password()}</Card.Title>
        <Card.Description>{m.passwordChangeDescription()}</Card.Description>
    </Card.Header>
    <Card.Content>
        <PasswordForm data={data.form}/>
    </Card.Content>
</Card.Root>