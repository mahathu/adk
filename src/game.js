import Snake from "./snake.js";
import { getRandomSpawn } from "./util.js";

export default class Game {
    constructor(ctx, players) {
        this.roundsPlayed = 0;
        this.roundActive = false;
        this.players = players;
        this.winScore = (players.length-1) * 10; // first to 10 round

        this.ctx = ctx;
        this.canvasWidth = ctx.canvas.clientWidth;
        this.canvasHeight = ctx.canvas.clientHeight;

        document.addEventListener('keydown', e => {
            if(e.key === ' '){ // spacebar
                this.startRound();
            }

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
        if(this.roundActive){
            console.log("Game is already active");
            return;
        }

        this.roundActive = true;
        this.roundsPlayed++;
        console.log("Started round "+this.roundsPlayed);

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.players.forEach((p, i) => {
            let initialPos = getRandomSpawn(
                this.canvasWidth, 
                this.canvasHeight, 
                this.players.slice(0,i) // only consider players that already have a snake
            );
            p['snake'] = new Snake(...initialPos);
            p['pointsReceived'] = 0;
            p['alive'] = true;
        });

        this.players.forEach(p => {
            p.snake.lineTo(p.snake.posX, p.snake.posY);
            this.ctx.lineWidth = 6;
            this.ctx.strokeStyle = p.color;
            this.ctx.stroke(p.snake);
        });
        window.setTimeout(() => {
            this.lastUpdate = performance.now();
            this.gameLoop = window.requestAnimationFrame((ts) => this.update(ts));
        }, 1500);
    }

    endRound() {
        this.roundActive = false;
        console.log('round over');
        cancelAnimationFrame(this.gameLoop);


        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = "black";
        
        this.players
        .sort((a, b) => b.score - a.score)
        .forEach((p, i) => {
            let msg = `${p.name}: ${p.score}` 
                + (p.pointsReceived > 0 ? ` (+${p.pointsReceived})` : '');
            this.ctx.fillText(msg, 10, (i+1)*30);
        });

        this.ctx.fillText("Press [space] to continue", 10, this.canvasHeight-20);
    }

    /** remove a player from the current round,
     * award every other surviving snake a point,
     * check if the round is over. */
    killPlayer(p) {
        p.alive = false;
        
        this.players.filter(p => p.alive).forEach(p => {
            p.score++;
            p.pointsReceived++;
        });

        if( this.players.filter(p => p.alive).length <= 1 ) {
            this.endRound();
            return;
        }
    }

    update(now){
		const dt = now - this.lastUpdate;
        this.lastUpdate = now;

        // Update player positions and draw them:
        for (const player of this.players.filter(p => p.alive)){
            player.snake.updatePosition(dt);

            this.ctx.lineWidth = player.snake.lineWidth;
            this.ctx.strokeStyle = player.color;
            this.ctx.stroke(player.snake);

            // Check if any player went out of bounds
            if (player.snake.outOfBounds(this.canvasWidth, this.canvasHeight)){
                this.killPlayer(player);
                continue;
            }

            // Test for collisions
            for(const otherPlayer of this.players){ //otherSnake <- snake to which collisions are compared
                if( player.snake.collidesWith(otherPlayer.snake) ){
                    this.killPlayer(player);
                    break;
                }
            }
        }

        if(this.roundActive){ //i.e. more than 1 player still alive
            this.gameLoop = window.requestAnimationFrame((ts) => this.update(ts));
        }
    }
}