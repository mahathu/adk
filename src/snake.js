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

        this.posX = posX;
        this.posY = posY;
        this.ang = 1;
        this.angBeforeSegmentStart = this.ang;
        this.MAX_ROTATE_BEFORE_NEW_HITLINE = Math.PI * 2 / 16; //TODO: make this global variable
        this.hitlines = [ new Line(this.posX, this.posY, this.posX, this.posY) ]; //end coords will be continuously updated

        this.turningLeft = false;
        this.turningRight = false;

        this.speed = .1;
        this.rotateAng = Math.PI / (360*2.5);
        this.lineWidth = 2.5;
    }

    updatePosition(dt) {
        let oldPos = [this.posX, this.posY];

        // UPDATE ANGLE
        if(this.turningLeft != this.turningRight){ //currently turning
            if(
                this.ang - this.angBeforeSegmentStart == 0 || // turn start
                Math.abs(this.ang - this.angBeforeSegmentStart) > this.MAX_ROTATE_BEFORE_NEW_HITLINE // long turn -> new hitline
            ){
                // save angle to keep track of when a new segment is needed
                this.angBeforeSegmentStart = this.ang;

                this.hitlines[this.hitlines.length - 1].x1 = this.posX;
                this.hitlines[this.hitlines.length - 1].y1 = this.posY;
                this.hitlines.push(new Line(this.posX, this.posY, this.posX, this.posY));
            }
            
            let fct = this.turningRight ? -1 : 1;
            this.ang += fct * this.rotateAng * dt;
        }

        // UPDATE POSITION
        this.posX += dt * this.speed * Math.sin(this.ang);
        this.posY += dt * this.speed * Math.cos(this.ang);

        this.moveTo(...oldPos);
        this.lineTo(this.posX, this.posY);
    }

    checkIfOutOfBounds(canvasWidth, canvasHeight) {
        // lineWidth multiplied by 1/3 to make hit detection more forgiving
        if( 
            this.posX < this.lineWidth/3 || this.posX > canvasWidth - this.lineWidth/3 ||
            this.posY < this.lineWidth/3 || this.posY > canvasHeight - this.lineWidth/3
        ) { return true; }
        return false;
    }
}