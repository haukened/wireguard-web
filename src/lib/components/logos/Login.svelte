<script lang="ts">
    export let size = "1.5em";
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" class="border rounded-full h-10 w-10 p-2">
    <defs>
        <style>
            .icon {
                fill: #000;
            }
            .dark .icon {
                fill: #fff;
            }
        </style>
    </defs>
    <path class="icon" d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"/>
</svg>