function Ghost(xCord, yCord, gColor, direction){
    this.x = xCord;
    this.y = yCord;
    this.color = gColor;
    this.dir = direction;
    this.isWeak = false;
    this.radius = Ghost_Radius;
    this.isMoving = false;
    this.isBlinking = false;
    this.isDead = false;
    this.speed = speed;
    this.stepCounter = 0;

}

//stuur de geest naar zijn huis
//locatie in het huis is gebaseerd op het kleur
Ghost.prototype.toGhostHouse = function() {
    var initX, initY;
    switch(this.color){
        case Orange:
            initX = ghostHouse[0][1]*Grid_Width + Grid_Width/2;
            initY = ghostHouse[0][0]*Grid_Width + Grid_Width/2;
            console.log(initX);
            break;

        case Cyan:
            initX =  ghostHouse[1][1]*Grid_Width + Grid_Width/2;
            initY =  ghostHouse[1][0]*Grid_Width + Grid_Width/2;
            break;

        case Pink:
            initX = ghostHouse[2][1]*Grid_Width + Grid_Width/2;
            initY = ghostHouse[2][0]*Grid_Width + Grid_Width/2;
            break;

        case Red:
            initX = ghostHouse[3][1]*Grid_Width + Grid_Width/2;
            initY = ghostHouse[3][0]*Grid_Width + Grid_Width/2;
            break;


    }
    this.x = initX;
    this.y = initY;
    this.dir = Down;
    this.stepCounter = 0;
};

Ghost.prototype.draw = function() {

    if(!this.isDead){
        // lichaam kleur
        if(this.isWeak){
            if(this.isBlinking){
                ctx.fillStyle = Blinking_Color;
            }
            else{
                ctx.fillStyle = Weak_Color;
            }
        }
        else{
            ctx.fillStyle = this.color;
        }

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
        ctx.moveTo(this.x-this.radius, this.y);


        // benen
        if (!this.isMoving){
            ctx.lineTo(this.x-this.radius, this.y+this.radius);
            ctx.lineTo(this.x-this.radius+this.radius/3, this.y+this.radius-this.radius/4);
            ctx.lineTo(this.x-this.radius+this.radius/3*2, this.y+this.radius);
            ctx.lineTo(this.x, this.y+this.radius-this.radius/4);
            ctx.lineTo(this.x+this.radius/3, this.y+this.radius);
            ctx.lineTo(this.x+this.radius/3*2, this.y+this.radius-this.radius/4);

            ctx.lineTo(this.x+this.radius, this.y+this.radius);
            ctx.lineTo(this.x+this.radius, this.y);
        }
        else {
            ctx.lineTo(this.x-this.radius, this.y+this.radius-this.radius/4);
            ctx.lineTo(this.x-this.radius+this.radius/3, this.y+this.radius);
            ctx.lineTo(this.x-this.radius+this.radius/3*2, this.y+this.radius-this.radius/4);
            ctx.lineTo(this.x, this.y+this.radius);
            ctx.lineTo(this.x+this.radius/3, this.y+this.radius-this.radius/4);
            ctx.lineTo(this.x+this.radius/3*2, this.y+this.radius);
            ctx.lineTo(this.x+this.radius, this.y+this.radius-this.radius/4);
            ctx.lineTo(this.x+this.radius, this.y);
        }


        ctx.fill();
    }


    if(this.isWeak){

        if(this.isBlinking){
            ctx.fillStyle = "#f00";
            ctx.strokeStyle = "f00";
        }
        else{
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
        }

        //ogen
        ctx.beginPath();//linker oog
        ctx.arc(this.x-this.radius/2.5, this.y-this.radius/5, this.radius/5, 0, Math.PI*2, true); // white
        ctx.fill();

        ctx.beginPath(); // rechter oog
        ctx.arc(this.x+this.radius/2.5, this.y-this.radius/5, this.radius/5, 0, Math.PI*2, true); // white
        ctx.fill();

        //mond
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.moveTo(this.x-this.radius+this.radius/5, this.y+this.radius/2);
        ctx.lineTo(this.x-this.radius+this.radius/3, this.y+this.radius/4);
        ctx.lineTo(this.x-this.radius+this.radius/3*2, this.y+this.radius/2);
        ctx.lineTo(this.x, this.y+this.radius/4);
        ctx.lineTo(this.x+this.radius/3, this.y+this.radius/2);
        ctx.lineTo(this.x+this.radius/3*2, this.y+this.radius/4);
        ctx.lineTo(this.x+this.radius-this.radius/5, this.y+this.radius/2);
        ctx.stroke();
    }
    else{
        // ogen
        ctx.fillStyle = "white"; //linker oog
        ctx.beginPath();
        ctx.arc(this.x-this.radius/2.5, this.y-this.radius/5, this.radius/3, 0, Math.PI*2, true); // white
        ctx.fill();

        ctx.fillStyle = "white"; //rechter oog
        ctx.beginPath();
        ctx.arc(this.x+this.radius/2.5, this.y-this.radius/5, this.radius/3, 0, Math.PI*2, true); // white
        ctx.fill();


        switch(this.dir){

            case Up:
                ctx.fillStyle="black"; //linker oogbal
                ctx.beginPath();
                ctx.arc(this.x-this.radius/3, this.y-this.radius/5-this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();

                ctx.fillStyle="black"; //rechter oogbal
                ctx.beginPath();
                ctx.arc(this.x+this.radius/3, this.y-this.radius/5-this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();
                break;

            case Down:
                ctx.fillStyle="black"; //linker oogbal
                ctx.beginPath();
                ctx.arc(this.x-this.radius/3, this.y-this.radius/5+this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();

                ctx.fillStyle="black"; //rechter oogbal
                ctx.beginPath();
                ctx.arc(this.x+this.radius/3, this.y-this.radius/5+this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();
                break;

            case Left:
                ctx.fillStyle="black"; //linker oogbal
                ctx.beginPath();
                ctx.arc(this.x-this.radius/3-this.radius/5, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();

                ctx.fillStyle="black"; //rechter oogbal
                ctx.beginPath();
                ctx.arc(this.x+this.radius/3-this.radius/15, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();
                break;

            case Right:
                ctx.fillStyle="black"; //linker oogbal
                ctx.beginPath();
                ctx.arc(this.x-this.radius/3+this.radius/15, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();

                ctx.fillStyle="black"; //rechter oogbal
                ctx.beginPath();
                ctx.arc(this.x+this.radius/3+this.radius/5, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
                ctx.fill();
                break;

        }

    }



};

Ghost.prototype.getRow = function() {
    return getRowIndex(this.y);
};

Ghost.prototype.getCol = function() {
    return getColIndex(this.x);
};

// maak in stap in de gegeven richting als dit toegestaan is
Ghost.prototype.moveOneStep = function() {
    // body...
    var newX =0;
    var newY =0;
    if(!canMove(this.x, this.y, this.dir)){
        return;
    }
    switch(this.dir){

        case Up:
            newY = this.y  - this.speed;
            if(newY - this.radius - Wall_Width > 0){
                this.y = newY;
            }
            break;

        case Down:
            newY = this.y + this.speed;
            if(newY + this.radius + Wall_Width < Canvas_Height) {
                this.y = newY;

            }
            break;


        case Left:
            newX = this.x - this.speed;
            if(newX - this.radius - Wall_Width > 0 ){
                this.x = newX;
            }
            break;

        case Right:
            newX = this.x + this.speed;

            if(newX + this.radius + Wall_Width < Canvas_Width){
                this.x = newX;
            }
            break;

        default:
            break;
    }
};

//maak een 180 graden bocht
Ghost.prototype.turnBack = function() {
    this.dir = oppositeDir(this.dir);
};

//probeer te draaien als dit noodzakelijk is en beweeg de geest
Ghost.prototype.move = function() {

    this.isMoving = !this.isMoving;//de geest lijkt te bewegen
    if(this.isWeak){
        //als het zwak is vertraag de snelheid en laat hem in tegengestelde richting bewegen
        // geest start met random bewegen tot hij terug normaal is
        this.speed = speed/2;
        if(weakCounter === Weak_Duration){
            this.dir = oppositeDir(this.dir);
        }
        if(onGridCenter(this.x, this.y) === false){
            this.moveOneStep();
        }
        else{
            var currGrid = maze[getRowIndex(this.y)][getColIndex(this.x)];
            if(currGrid.gridType === Left_Top_Right){
                this.dir = Down;
                this.moveOneStep();
            }
            else if(currGrid.gridType === Top_Right_Bottom){
                this.dir = Left;
                this.moveOneStep();
            }
            else if(currGrid.gridType === Right_Bottom_Left){
                this.dir = Up;
                this.moveOneStep();
            }
            else if(currGrid.gridType === Bottom_Left_Top){
                this.dir = Right;
                this.moveOneStep();
            }
            else{
                this.randomMove();
            }

        }

        this.stepCounter++;
    }
    else{
        //normale geest
        if(this.stepCounter != 0 && this.stepCounter % 2 !=0){
            this.speed = speed/2;
            this.stepCounter = 0;
        }
        else{
            this.speed = speed;
        }
        if(onGridCenter(this.x, this.y) === false){
            this.moveOneStep();
        }
        else{
            // op een grid center
            //eerst checken of hij dood is
             var currGrid = maze[getRowIndex(this.y)][getColIndex(this.x)];
            if(currGrid.gridType === Left_Top_Right){
                this.dir = Down;
                this.moveOneStep();
            }
            else if(currGrid.gridType === Top_Right_Bottom){
                this.dir = Left;
                this.moveOneStep();
            }
            else if(currGrid.gridType === Right_Bottom_Left){
                this.dir = Up;
                this.moveOneStep();
            }
            else if(currGrid.gridType === Bottom_Left_Top){
                this.dir = Right;
                this.moveOneStep();
            }
            else{
                switch(this.color){
                    case Red:
                        //blinky
                        this.blinkyMove();
                        break;

                    case Cyan:
                    case Orange:
                        //inky
                        this.inkyMove();
                        break;

                    case Pink:
                        //pinky
                        this.pinkyMove();
                        break;
                }
            }
        }
    }

};

//blinky kiest altijd de tegel dat hem het dichtst bij pacman brengt
Ghost.prototype.blinkyMove = function() {
    this.moveToPacman(true);
};

//pinky kiest de tegel dat 4 stappen voor pacman is
Ghost.prototype.pinkyMove = function() {
    this.moveToPacman(false);
};

//inky is onvoorspelbaar maakt random bewegingen
Ghost.prototype.inkyMove = function() {
    this.randomMove();
};

Ghost.prototype.moveToPacman = function(targetPacman) {
    var veryLargeDistance = Canvas_Width*Canvas_Height;
    var leftDist, rightDist, upDist, downDist;
    var currDir = this.dir;
    var minDist = veryLargeDistance;
    //haal afstand als hij naar links beweegt
    if(currDir === Right || !canMove(this.x, this.y, Left)){
        leftDist = minDist;
    }
    else{
        leftDist = this.getTestDistance(Left,targetPacman);
    }

    //haal afstand als hij naar rechts beweegt
    if(currDir === Left || !canMove(this.x, this.y, Right)){
        rightDist = veryLargeDistance;
    }
    else{
        rightDist = this.getTestDistance(Right,targetPacman);
    }

    //haal afstand als hij naar omhoog beweegt
    if(currDir === Down || !canMove(this.x, this.y, Up)){
        upDist = veryLargeDistance;
    }
    else{
        upDist = this.getTestDistance(Up,targetPacman);
    }

    //haal afstand als hij naar omlaag beweegt
    if(currDir === Up || !canMove(this.x, this.y, Down)){
        downDist = veryLargeDistance;
    }
    else{
        downDist = this.getTestDistance(Down, targetPacman);
    }
    this.dir = currDir;
    minDist = Math.min(Math.min(leftDist, rightDist), Math.min(upDist, downDist));
    switch(minDist){
        case leftDist:
            this.dir = Left;
            break;

        case rightDist:
            this.dir = Right;
            break;

        case upDist:
            this.dir = Up;
            break;

        case downDist:
            this.dir = Down;
            break;
    }
    this.moveOneStep();
};

// haal de afstand van de geest naar pacman als hij 1 stap in de gegeven richting zet
Ghost.prototype.getTestDistance = function(dir, targetPacman) {
    var toReturn = 0;
    this.dir = dir;
    this.moveOneStep();
    if(targetPacman){
        toReturn = Math.sqrt(Math.pow( (this.x - mrPacman.x)  ,2)+Math.pow( this.y -mrPacman.y,2));
    }
    else{
        switch(mrPacman.dir){
            case Left:
                toReturn = Math.sqrt(Math.pow( (this.x - (mrPacman.x - 4*Grid_Width))  ,2)+Math.pow( this.y -mrPacman.y,2));
                break;

            case Right:
                toReturn = Math.sqrt(Math.pow( (this.x - (mrPacman.x + 4*Grid_Width))  ,2)+Math.pow( this.y -mrPacman.y,2));
                break;

            case Up:
                toReturn = Math.sqrt(Math.pow( (this.x - mrPacman.x)  ,2)+Math.pow( this.y - (mrPacman.y - 4*Grid_Height),2));
                break;

            case Down:
                toReturn = Math.sqrt(Math.pow( (this.x - mrPacman.x)  ,2)+Math.pow( this.y - (mrPacman.y  + 4*Grid_Height),2));
                break;

            default:
                toReturn = Math.sqrt(Math.pow( (this.x - mrPacman.x)  ,2)+Math.pow( this.y -mrPacman.y,2));
                break;

        }
    }
    this.turnBack();
    this.moveOneStep();
    return toReturn;
};

Ghost.prototype.randomMove = function() {
    var nextDir =  parseInt(Math.random()*4)+1;
    while(true){
        if( nextDir != oppositeDir(this.dir)
            && canMove(this.x, this.y, nextDir)){
            break;
        }
        nextDir =  parseInt(Math.random()*4)+1;
    }

    this.dir = nextDir;
    this.moveOneStep();
};
