<script>
    import { createEventDispatcher } from "svelte";
    import { getKeyRepresentation } from "../util";
    export let player;

    const dispatch = createEventDispatcher();
</script>

<div class="text-xl flex">
    <input type="color" value={player.color}>
    <input type="text" class="player-name grow" value={player.name} size="1" maxlength="15">
    <div class="flex">
        <div class="w-6">{getKeyRepresentation(player.keyL)}</div>
        <div class="w-6">{getKeyRepresentation(player.keyR)}</div>
        <button on:click={() => dispatch('remove', player)}>X</button>
    </div>
</div>

<style>
    input[type="color"]{
        height: 32px;
        width: 32px;
        border: none;
        border-radius: 3px;
        padding: 0;
        cursor: pointer;
        /* -webkit-appearance: none; */
    }

    input[type="color"]::-webkit-color-swatch-wrapper{
        padding: 0; 
    }
    input[type="color"]::-webkit-color-swatch{
        border: none;
        border-radius: 3px;
    }

    .player-name{
        flex-grow: 1;
        margin-left: 4px;
        border: none;
        cursor: pointer;
        transition: .075s;
    }
</style>