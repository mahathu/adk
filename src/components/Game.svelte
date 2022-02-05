<script>
	/**
	 * TODOS
	 * add high contrast mode
	 * add more settings (rotation angle, speed)
	 * add mode that incrementally speeds up snakes each round
	 * add FPS counter
	 * improve scoreboard between rounds, blur background
	 * make player OOP
	 * make controls customizable
	 * disable buttons while game/round is active
	*/
	import { onMount } from "svelte";
	import Game from "../game";
	import Player from "./Player.svelte";

	const MAX_PLAYERS = 6;
	const CANVAS_WIDTH = 660;
	const CANVAS_HEIGHT = 560;

	let ctx;

	export let defaultPlayers = [];

	let players = [];

	function addPlayer(){
		let id = players.length == 0 ? 1 : Math.max(...players.map(p => p.id)) + 1;
		let name = `Player ${id}`;
		let color = '#ff0000';
		let keyL = '_';
		let keyR = '_';
		let score = 0;

		if( id <= defaultPlayers.length ) {
			color = defaultPlayers[id-1]['color'];
			keyL = defaultPlayers[id-1]['keyL'];
			keyR = defaultPlayers[id-1]['keyR'];
		}
		players = [...players, { id, name, color, keyL, keyR, score }];
	}

	function removePlayer(player) {
		players = players.filter(p => p.id !== player.id)
	}

	function startGame(){
		let game = new Game(ctx, players);
	}

	onMount(() => {
		addPlayer();
		addPlayer();
		addPlayer();
		
		ctx = document.getElementById('board').getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		startGame();
	});
</script>

<div class="flex">
	<canvas 
			width={CANVAS_WIDTH*window.devicePixelRatio} 
			height={CANVAS_HEIGHT*window.devicePixelRatio}
			style="width: {CANVAS_WIDTH}px; height: {CANVAS_HEIGHT}px;"
			id="board" 
			class="box-content border-2 border-current"></canvas>

	<div class="ml-5 grow space-y-3">
		{#each players as player (player.id)}
		<Player {player}
			on:remove={e => removePlayer(e.detail)}
		/>
		{/each}

		<button class="border-2 border-current px-1" on:click={addPlayer} disabled={players.length >= MAX_PLAYERS}>Add Player</button>
		<button class="border-2 border-current px-1" on:click={startGame} disabled={players.length < 2}>Start Game</button>
	</div>
</div>

<style>
</style>