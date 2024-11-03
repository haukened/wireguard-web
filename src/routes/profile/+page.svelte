<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as m from '$lib/paraglide/messages.js';
    import Separator from "$lib/components/ui/separator/separator.svelte";
	import PasswordForm from "../password/passwordForm.svelte";
	import ProfileForm from "./profileForm.svelte";

    export let data;
</script>

<Card.Root class="w-96 max-w-full">
    <Card.Header>
        <Card.Title>{m.profile()}</Card.Title>
        <Card.Description>{m.profileDescription()}</Card.Description>
    </Card.Header>
    <Card.Content>
        <ProfileForm data={data.form}/>
    </Card.Content>
</Card.Root>

