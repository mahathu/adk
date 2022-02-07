import { distance } from './util.js';

class Line {
    constructor(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
    }
}

export default class Snake extends Path2D{
    constructor(posX, posY, ang) {
        super();

        this.seed = Math.random();
        this.posX = posX;
        this.posY = posY;
        this.ang = ang;
        this.angBeforeSegmentStart = this.ang;

        this.MAX_ROTATE_BEFORE_NEW_HITLINE = Math.PI * 2 / 10; //10 segments per circle //TODO: make this global variable
        this.hitlines = [ new Line(this.posX, this.posY, this.posX, this.posY) ]; //end coords will be continuously updated

        this.turningLeft = false;
        this.turningRight = false;

        this.speed = .115;
        this.rotateAng = Math.PI / (360*2);
        this.lineWidth = 2.5;
    }

    updatePosition(dt, freezeTime) {
        let oldPos = [this.posX, this.posY];

        // UPDATE ANGLE
        if(this.turningLeft != this.turningRight){ //currently turning
            if( 
                this.ang - this.angBeforeSegmentStart == 0 || // new turn
                Math.abs(this.ang - this.angBeforeSegmentStart) > this.MAX_ROTATE_BEFORE_NEW_HITLINE // long turn -> new hitline
            ){ this.createNewHitline(); }
            
            // update the snake's angle:
            let fct = this.turningRight ? -1 : 1;
            this.ang += fct * this.rotateAng * dt;
        }

        // UPDATE POSITION
        this.posX += dt * this.speed * Math.sin(this.ang);
        this.posY += dt * this.speed * Math.cos(this.ang);

        // UPDATE HITBOXES
        // modify the end coordinate of the current (last) hitline:
        this.hitlines[this.hitlines.length - 1].x1 = this.posX;
        this.hitlines[this.hitlines.length - 1].y1 = this.posY;

        if(this.turningLeft == this.turningRight && this.angBeforeSegmentStart != this.ang){ // just stopped turning
            this.angBeforeSegmentStart = this.ang;
            // add a new hitline, now that the line is straight again.
            // otherwise, hitline won't line up with the snake after it stopped turning
            this.hitlines.push(new Line(this.posX, this.posY, this.posX, this.posY));
        }

        this.moveTo(...oldPos);
        this.lineTo(this.posX, this.posY);
    }

    collidesWith(otherSnake){ // doesn't work at high speeds!
        // TODO: fix this by instead checking for intersection
        // between the latest hitline of this snake and the other
        // sections, instead of comparing the current position
        let coll_hitlines = otherSnake.hitlines;

        //TODO: fix this comparison (it works, but is ugly)
        if(otherSnake.seed == this.seed){
            // testing snake collisions with itseslf
            coll_hitlines = coll_hitlines.slice(0, -5);
        }

        return coll_hitlines.some(hl => distance(this.posX, this.posY, hl) < otherSnake.lineWidth/2);
    }

    outOfBounds(canvasWidth, canvasHeight) {
        // lineWidth multiplied by 1/3 to make hit detection more forgiving
        if( 
            this.posX < this.lineWidth/3 || this.posX > canvasWidth - this.lineWidth/3 ||
            this.posY < this.lineWidth/3 || this.posY > canvasHeight - this.lineWidth/3
        ) { return true; }
        return false;
    }

    createNewHitline(){
        /** save angle to keep track of when a new segment is needed. 
         * Once the new angle becomes too different to angBeforeSegmentStart,
         * a new hitline will be created. */
        this.angBeforeSegmentStart = this.ang;

        // Set the end coordinates of the last hitline to the current position:
        this.hitlines[this.hitlines.length - 1].x1 = this.posX;
        this.hitlines[this.hitlines.length - 1].y1 = this.posY;

        // Add a new hitline, starting at the current coordinates.
        this.hitlines.push(new Line(this.posX, this.posY, this.posX, this.posY));
    }
}