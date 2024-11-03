<script lang="ts">
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";
    import * as m from "$lib/paraglide/messages";
    
    import { resetMode, setMode } from "mode-watcher";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
</script>
    
<DropdownMenu.Root>
<DropdownMenu.Trigger>
    <Button variant="outline" size="icon" class="rounded-full">
        <Sun
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
    </Button>
</DropdownMenu.Trigger>
<DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>{m.lightModeLabel()}</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>{m.darkModeLabel()}</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>{m.systemModeLabel()}</DropdownMenu.Item>
</DropdownMenu.Content>
</DropdownMenu.Root>