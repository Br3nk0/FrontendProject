/**
 * Created by BrenkoD on 6/11/2014.
 */
function Pacman(xCord,yCord,direction){
    this.x = xCord;
    this.y = yCord;
    this.dir = direction;
    this.nextDir = undefined;
    this.radius = Pacman_Radius;
    this.mouthOpen = true;
}

Pacman.prototype.draw = function(color){
    if(color == undefined){
        ctx.fillStyle = Pacman_Color;
    }else{
        ctx.fillStyle = color;
    }
    ctx.beginPath();

    if(!this.mouthOpen){
        switch(this.dir){
            case Up:
                ctx.arc(this.x, this.y, this.radius, 2* Math.PI - Math.PI*11/18, 2*Math.PI - Math.PI*7/18, true );
                break;
            case Down:
                ctx.arc(this.x, this.y, this.radius, 2*Math.PI - Math.PI*29/18, 2*Math.PI-Math.PI*25/18, true);
                break;
            case Left:
                ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*10/9, 2*Math.PI-Math.PI*8/9, true);
                break;
            case Right:
                ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI/9, 2*Math.PI-Math.PI*17/9, true);
                break;

            default:
                break;
        }
    }
    else {
        switch(this.dir){
            case Up:
                ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*7/9, 2*Math.PI-Math.PI*2/9, true);
                break;
            case Down:
                ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*16/9, 2*Math.PI-Math.PI*11/9, true);
                break;
            case Left:
                ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*23/18, 2*Math.PI-Math.PI*13/18, true);
                break;
            case Right:
                ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*5/18, 2*Math.PI-Math.PI*31/18, true);
                break;

            default:
                break;

        }
    }
    ctx.lineTo(this.x, this.y);
    ctx.fill();
};

// rijindex ophalen van de huidige locatie
Pacman.prototype.getRow = function(){
    return getRowIndex(this.y);
}
// kolom index ophalen van de huidige locatie
Pacman.prototype.getCol = function(){
    return getColIndex(this.x);
}
// return als pacman kan begewegen in de huidge richting
Pacman.prototype.canMove = function(dir){
    return canMove(this.x,this.y, dir);
}
// probeer te draaien als het nodig is en te bewegen
Pacman.prototype.move = function(){
    if(onGridCenter(this.x, this.y)=== false){
        // niet op grid center
        if (this.nextDir != undefined && (
            (this.dir === Up && this.nextDir === Down)||
            (this.dir === Down && this.nextDir === Up) ||
            (this.dir === Left && this.nextDir === Right)||
            (this.dir === Right && this.nextDir === Left)
            ))
        {
            this.dir = this.nextDir;
            this.nextDir = undefined;
        }
        this.moveOneStep();
        return;
    }
    else{
        // op grid center, verander richting als het nodig is
        if(this.nextDir != undefined && this.canMove(this.nextDir)){
            this.dir = this.nextDir;
            this.nextDir = undefined;
            this.moveOneStep();
        }else{
            // check of pacman can blijven bewegen
            if(this.canMove(this.dir)){
                this.moveOneStep();
            }
        }
    }
};

//beweeg in stap in de huidige richting als dit toegestaan is
Pacman.prototype.moveOneStep = function(){
    var newX = 0;
    var newY = 0;
    if(!canMove(this.x,this.y, this.dir)){
        return;
    }
    switch(this.dir){

        case Up:
            newY = this.y  - speed;
            if(newY - this.radius - Wall_Width > 0){
                this.y = newY;
                this.mouthOpen = ! this.mouthOpen;
            }
            break;

        case Down:
            newY = this.y + speed;
            if(newY + this.radius + Wall_Width < Canvas_Height) {
                this.y = newY;
                this.mouthOpen = ! this.mouthOpen;

            }
            break;


        case Left:
            newX = this.x - speed;
            if(newX - this.radius - Wall_Width > 0 ){
                this.x = newX;
                this.mouthOpen = ! this.mouthOpen;
            }
            break;

        case Right:
            newX = this.x + speed;

            if(newX + this.radius + Wall_Width < Canvas_Width){
                this.x = newX;
                this.mouthOpen = ! this.mouthOpen;
            }
            break;

        default:
            break;
    }
};