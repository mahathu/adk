import Snake from "./snake.js";
import { getRandomSpawn } from "./util.js";

export default class Game {
    constructor(ctx, players) {
        this.roundsPlayed = 0;
        this.players = players;
        this.ctx = ctx;
        this.width = ctx.canvas.clientWidth;
        this.height = ctx.canvas.clientHeight;

        this.startRound();
    }

    startRound() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.roundStartTime = Date.now();

        this.roundsPlayed++;
        console.log("Started round "+this.roundsPlayed);

        this.players.map((p, i) => {
            let initialPos = getRandomSpawn(
                this.width, 
                this.height, 
                this.players.slice(0,i) // only consider players that already have a snake
            );
            p['snake'] = new Snake(...initialPos);
            p['alive'] = true;
        });

        window.requestAnimationFrame(() => {this.update(Date.now())});
    }

    update(last_frame){
		let now = Date.now();

		let dt = now-last_frame;
		last_frame = now;

        for (const player of this.players.filter(p => p.alive)){
            player.snake.updatePosition(dt);
            player.alive = !player.snake.checkIfOutOfBounds(this.width, this.height);

            this.ctx.lineWidth = player.snake.lineWidth;
            this.ctx.strokeStyle = player.color;
            this.ctx.stroke(player.snake);
        }
        
		window.requestAnimationFrame(() => {this.update(last_frame)});
    }
}