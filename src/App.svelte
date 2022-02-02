<script>
    import Game from './components/Game.svelte';
    
    let defaultPlayers = [
		{ color: '#E6CC83', keyL: 'q', keyR: 'w' },
		{ color: '#85CADD', keyL: 'ArrowLeft', keyR: 'ArrowRight' },
		{ color: '#D2565C', keyL: 'x', keyR: 'c' },
		{ color: '#2A2A2A', keyL: 'i', keyR: 'o' },
	];
</script>

<div class="flex items-center max-w-5xl m-auto h-screen">
	<div class="bg-white grow px-8 py-8 shadow-2xl rounded-xl">
		<h1 class="text-5xl mb-8 font-serif">Achtung, die Kurve!</h1>
		<Game {defaultPlayers}/>
	</div>	
</div>

<style lang="postcss" global>
	@font-face {
		font-family: EB Garamond;
		src: url(/fonts/EBGaramond/EBGaramond-SemiBold.ttf);
	}

	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	/* *{
		outline: 1px solid grey;
	} */

</style>