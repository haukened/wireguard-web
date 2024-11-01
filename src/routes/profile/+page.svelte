<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as m from '$lib/paraglide/messages.js';
    import Separator from "$lib/components/ui/separator/separator.svelte";
	import PasswordForm from "./passwordForm.svelte";
	import ProfileForm from "./profileForm.svelte";

    export let data;
</script>

<div class="flex flex-col sm:space-y-4 md:space-y-0 md:flex-row md:space-x-4">
    <Card.Root class="w-96 max-w-full">
        <Card.Header>
          <Card.Title>{m.profile()}</Card.Title>
          <Card.Description>{m.profileDescription()}</Card.Description>
        </Card.Header>
        <Card.Content>
            <ProfileForm data={data.profileForm}/>
        </Card.Content>
    </Card.Root>
    <Card.Root class="w-96 max-w-full h-full">
        <Card.Header>
          <Card.Title>{m.password()}</Card.Title>
          <Card.Description>{m.passwordChangeDescription()}</Card.Description>
        </Card.Header>
        <Card.Content>
            <PasswordForm data={data.passwordForm}/>
        </Card.Content>
    </Card.Root>
</div>
