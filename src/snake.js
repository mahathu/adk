export default class Snake extends Path2D{
    constructor(posX, posY, ang) {
        super();

        this.posX = posX;
        this.posY = posY;
        this.ang = ang;
        this.speed = .1;
        this.lineWidth = 2.5;
    }

    updatePosition(dt) {
        let oldPos = [this.posX, this.posY];
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
        ) {
            console.log("Player went out of bounds"+canvasWidth+" - "+canvasHeight);
            return true;
        }
        return false;
    }
}