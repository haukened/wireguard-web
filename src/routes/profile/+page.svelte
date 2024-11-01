<script lang="ts">
	import type { PageData } from "../$types";

    let { data }: { data: PageData } = $props();
</script>

<p>{JSON.stringify(data.user, null, 2)}</p>