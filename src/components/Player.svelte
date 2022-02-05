<script>
    import { createEventDispatcher } from "svelte";
    import { getKeyRepresentation } from "../util";
    export let player;
    export let gameActive;

    const dispatch = createEventDispatcher();
</script>

<div class="text-xl flex">
    <input type="color" bind:value={player.color} disabled={gameActive}>
    <input type="text" class="player-name grow" 
            bind:value={player.name}
            disabled={gameActive}
            size="1" maxlength="15">
    <div class="flex items-center text-center font-bold font-mono">
        <div class="w-6">{getKeyRepresentation(player.keyL)}</div>
        <div class="w-6">{getKeyRepresentation(player.keyR)}</div>
        <button
            class="rm-btn text-gray-500 border-gray-500
            hover:text-gray-600 hover:border-gray-600
            transition duration-75 rounded-full"
            on:click={() => dispatch('remove', player)}
          disabled={gameActive}
        >×</button>
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
    .player-name:disabled{
        color: inherit;
        background: inherit;
    }
    input:disabled{
        cursor: default;
    }
    .rm-btn{
        width: 22px;
        height: 22px;
        line-height: 20px;
    }
</style>