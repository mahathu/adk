import Snake from "./snake.js";
import { getRandomSpawn } from "./util.js";

export default class Game {
    constructor(ctx, players) {
        this.roundsPlayed = 0;
        this.players = players;
        this.ctx = ctx;
        this.width = ctx.canvas.clientWidth;
        this.height = ctx.canvas.clientHeight;

        document.addEventListener('keydown', e => {
            for (const player of this.players.filter(p => p.alive)){
                if (e.key === player.keyL){
                    player.snake.turningLeft = true;
                } else if (e.key === player.keyR){
                    player.snake.turningRight = true;
                }
            }
        });
        document.addEventListener('keyup', e => {
            for (const player of this.players.filter(p => p.alive)){
                if (e.key === player.keyL){
                    player.snake.turningLeft = false;
                } else if (e.key === player.keyR){
                    player.snake.turningRight = false;
                }
            }
        });

        this.startRound();
    }

    startRound() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.roundStartTime = performance.now();

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

        window.requestAnimationFrame(() => {this.update(performance.now())});
    }

    update(last_frame){
		const now = performance.now();
		const dt = now-last_frame;

        for (const player of this.players.filter(p => p.alive)){
            player.snake.updatePosition(dt);

            player.alive = !player.snake.checkIfOutOfBounds(this.width, this.height);

            for(const otherPlayer of this.players){ //otherSnake <- snake to which collisions are compared
                if( player.snake.collidesWith(otherPlayer.snake) ){
                    console.log(player.color + " crashed into "+otherPlayer.color);
                    player.alive = false;
                }
            }

            this.ctx.lineWidth = player.snake.lineWidth;
            this.ctx.strokeStyle = player.color;
            this.ctx.stroke(player.snake);
        }

        // ineffectivelydraw hitlines (just for debugging)
        // this.ctx.strokeStyle = 'red';
        // for (const hitlines of this.players.map(p => p.snake.hitlines)){
        //     this.ctx.moveTo(hitlines[0].x0, hitlines[0].y0);
        //     for (const line of hitlines){
        //         this.ctx.lineTo(line.x1, line.y1);
        //     }
        // }
        // this.ctx.stroke();

		window.requestAnimationFrame(() => {this.update(now)});
    }
}