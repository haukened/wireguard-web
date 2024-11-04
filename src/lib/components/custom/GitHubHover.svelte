<script lang="ts">
    import * as Avatar from '$lib/components/ui/avatar';
    import * as HoverCard from '$lib/components/ui/hover-card';
    import { Skeleton } from '$lib/components/ui/skeleton';
    import { GitHub } from '../logos';

    export let size: string = "2em";

    async function loadGitHubData() {
        const response = await fetch(`https://api.github.com/repos/haukened/wireguard-web`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    let dataPromise: Promise<any> = new Promise(() => {});
</script>
<div role="note" on:mouseover|once={() => {dataPromise = loadGitHubData()}} on:focus={() => {}}>
  <HoverCard.Root>
    <HoverCard.Trigger
      href="https://github.com/haukened/wireguard-web"
      target="_blank"
      rel="noreferrer noopener"
      class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
    >
      <GitHub/>
    </HoverCard.Trigger>
    <HoverCard.Content class="w-80">
    {#await dataPromise}
    <div class="flex items-center space-x-4">
      <div class="space-y-2 w-full">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
      </div>
      <Skeleton class="h-12 w-12 rounded-full" />
    </div>
    {:then data}
    <div class="flex flex-col space-y-4">
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <span class="text-md font-bold">{data.full_name}</span>
          <span class="text-xs font-light">{data.description}</span>
        </div>
        <Avatar.Root class="h-16 w-16">
          <Avatar.Image src={data.owner.avatar_url}/>
          <Avatar.Fallback>WG</Avatar.Fallback>
        </Avatar.Root>
      </div>
      <div class="flex justify-start space-x-6">
        <span class="text-sm font-light">Stars: {data.stargazers_count}</span>
        <span class="text-sm font-light">Watchers: {data.watchers_count}</span>
        <span class="text-sm font-light">Forks: {data.forks_count}</span>
        <span class="text-sm font-light">Issues: {data.open_issues_count}</span>
      </div>
    </div>
    {:catch error}
    <p style="color: red;">Error: {error.message}</p>
    {/await}
    </HoverCard.Content>
  </HoverCard.Root>
</div>