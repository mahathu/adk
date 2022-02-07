export function randFromInterval(min, max){
    return Math.random() * (max - min) + min;
}

export function getKeyRepresentation(key){
    if(key === 'ArrowLeft') {
        return '<';
    } else if(key === 'ArrowRight') {
        return '>';
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

export function intersects(l1, l2) {
    return false;
}

export function distance(x, y, line) {
    let A = x - line.x0;
    let B = y - line.y0;
    let C = line.x1 - line.x0;
    let D = line.y1 - line.y0;

    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = line.x0;
        yy = line.y0;
    } else if (param > 1) {
        xx = line.x1;
        yy = line.y1;
    } else {
        xx = line.x0 + param * C;
        yy = line.y0 + param * D;
    }

    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}