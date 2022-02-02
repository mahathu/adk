export function randFromInterval(min, max){
    return Math.random() * (max - min) + min;
}

export function getKeyRepresentation(key){
    if(key === 'ArrowLeft') {
        return '◁';
    } else if(key === 'ArrowRight') {
        return '▷';
    }
    return key.toUpperCase();
}

/** find a pseudo-random spawn position
 * based on location of other players
 */
export function getRandomSpawn(canvasWidth, canvasHeight, players) {
    let minEdgeDist = 100;
    let minOtherSnakeDist = 100;
    const MAX_ATTEMPTS = 50;

    let prevSpawns = players.map(p => [p.snake.posX, p.snake.posY]);

    let x,y;
    let attempts = 0;

    outerLoop:
    while(attempts++ < MAX_ATTEMPTS){
        x = randFromInterval(minEdgeDist, canvasWidth-minEdgeDist);
        y = randFromInterval(minEdgeDist, canvasHeight-minEdgeDist);

        for(const otherSpawn of prevSpawns){            
            if(Math.sqrt( (x-otherSpawn[0])**2 + (y-otherSpawn[1])**2 ) < minOtherSnakeDist){
                continue outerLoop;
            }
        }
        break;
    }

    if(attempts >= MAX_ATTEMPTS){
        console.warn(`Maximum number of attempts reached to find a spawn for player #${prevSnakes.length+1}.`);
    }
    
    return [x, y, randFromInterval(0, Math.PI)];
}