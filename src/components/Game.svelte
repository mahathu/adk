<script>
	/**
	 * TODOS
	 * fix collision detection by checking for line intersections
	 * add high contrast mode
	 * add more settings (rotation angle, speed)
	 * add mode that incrementally speeds up snakes each round
	 * add FPS counter
	 * improve scoreboard between rounds, blur background
	 * make player OOP
	 * make controls customizable
	 * disable buttons while game/round is active
	 * add debug mode (auto start round, more players, disable out of board collisions)
	*/
	import { onMount } from "svelte";
	import Game from "../game";
	import Player from "./Player.svelte";

	const MAX_PLAYERS = 6;
	const CANVAS_WIDTH = 660;
	const CANVAS_HEIGHT = 560;

	let ctx, game;
	let gameActive = false;

	export let defaultPlayers = [];

	let players = [];

	function addPlayer(){
		let id = players.length == 0 ? 1 : Math.max(...players.map(p => p.id)) + 1;
		let name = `Player ${id}`;
		let color = '#' + ((1<<24)*Math.random() | 0).toString(16); //https://stackoverflow.com/a/5365036/
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
		game = new Game(ctx, players);
		gameActive = true;
	}

	onMount(() => {
		ctx = document.getElementById('board').getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		addPlayer();
		addPlayer();
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

	<div class="ml-5 grow flex justify-between flex-col">
		<div class="space-y-2">
			<div class="flex justify-end">
				<button class="border border-current px-2" on:click={addPlayer} disabled={gameActive || players.length >= MAX_PLAYERS}>Add Player</button>
			</div>

			{#each players as player (player.id)}
			<Player {player} {gameActive}
				on:remove={e => removePlayer(e.detail)}
			/>
			{/each}
		</div>

		<div>
			<button class="border border-current w-full" disabled>More Options (coming soon™)</button>
			<button class="w-full mt-2 transition border-2
				bg-blue-700
				border-blue-700
				hover:shadow-sm hover:shadow-blue-700
				active:bg-blue-800 active:border-blue-800 active:shadow-none
				disabled:shadow-none disabled:bg-transparent disabled:border-current
				py-2 text-lg text-white" on:click={startGame} disabled={gameActive || players.length < 2}>{gameActive ? "Game is Active" : "Start Game"}</button>
		</div>
	</div>
</div>

<style>
	/* .start-btn{
		text-shadow: 0 2px 4px rgba(0,0,0,0.15);
	} */
</style>