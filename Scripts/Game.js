

var canvasID = "myCanvas";
var Canvas_Width = 510;
var Canvas_Height = 510;
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext("2d");

// game grid
var Grid_Width = 30;
var Grid_Height = 30;
var Wall_Width = 3;
var numRows = Canvas_Width/Grid_Height;
var numCols = Canvas_Height/Grid_Width;

// colors for UI & Pacman
var Bg_Color = "black";
var Border_Color = "blue";
var Bean_Color= "white";
var Pacman_Color = "yellow";

// colors for ghost
var Red = "red";
var Pink = "#ff9cce";
var Cyan = "#00ffde";
var Orange = "#ffb847";
var Weak_Color = "#0031ff";
var Blinking_Color = "white";

// size of sprites
var Normal_Bean_Radius = 2;
var Power_Bean_Radius= 5;
var Pacman_Radius= 9;
var Ghost_Radius = 9;

// directions
var Up = 1;
var Down = 2;
var Left = 3;
var Right = 4;


// game parameters
var Interval;
var restartTimer = 0;
var timerDelay = 80;
var speed = 5;
var score = 0;
var lives = [];
var Max_Life = 3;
var life = Max_Life;
var weakBonus = 200;
var Max_Beans = 136;
var beansLeft = Max_Beans;
var weakCounter;
var Weak_Duration = 10000/timerDelay;


//bean cases
var Normal_Bean = 1
var Power_Bean = 2;

//spirtes instances
var welcomePacman;
var welcomeBlinky;
var welcomeInky;
var mrPacman;
var blinky;
var inky;
var pinky;
var clyde;
var ghosts;

//game state and map
var gameOn = false;
var gamePaused = false;
var maze = new Array(Canvas_Height/Grid_Height);
var mazeContent = [
//row1
    [Left_Top, Top_Bottom, Top_Only, Top_Only, Top_Bottom,
        Top_Only, Top_Bottom, Right_Top, Left_Top, Top_Only,
        Top_Only, Top_Only, Top_Only, Top_Only, Top_Only,
        Top_Only, Right_Top],
//row2
    [Left_Right, Left_Top_Right, Left_Bottom, Right_Only, Left_Top_Right,
        Left_Right, Closed_Grid, Left_Right, Left_Bottom, Bottom_Only,
        Bottom_Only, Bottom_Only, Bottom_Only, Bottom_Only, Empty_Grid,
        Empty_Grid, Right_Only],
//row3
    [Left_Right, Left_Only, Top_Right_Bottom, Right_Bottom_Left, Left_Right,
        Left_Only, Top_Bottom, Empty_Grid, Top_Only, Top_Bottom,
        Top_Only, Top_Only, Top_Bottom, Right_Top, Left_Only,
        Empty_Grid, Right_Only],
//row4
    [Left_Right, Left_Right, Left_Top_Right,Bottom_Left_Top, Right_Only, Left_Right,
        Left_Top_Right, Left_Bottom, Right_Only, Closed_Grid, Left_Only,
        Right_Bottom, Left_Top_Right, Left_Right, Left_Only,
        Empty_Grid, Right_Only],
//row5
    [Left_Right, Right_Bottom_Left, Left_Only, Right_Top, Right_Bottom_Left,
        Left_Right, Left_Only, Top_Right_Bottom, Left_Bottom, Top_Only,
        Right_Bottom, Bottom_Left_Top, Right_Only, Left_Right, Left_Only,
        Empty_Grid, Right_Only],
//row6
    [Left_Bottom, Top_Only, Bottom_Only, Bottom_Only, Top_Bottom,
        Right_Only, Left_Right, Left_Top_Right, Closed_Grid, Right_Bottom_Left,
        Closed_Grid, Left_Top_Right, Left_Right, Left_Right, Left_Bottom,
        Bottom_Only, Right_Bottom],
//row7
    [Left_Top_Right, Left_Right, Left_Top, Top_Only, Right_Top,
        Left_Right, Right_Bottom_Left, Left_Only, Right_Top, Closed_Grid,
        Left_Top, Right_Only, Right_Bottom_Left, Left_Only, Right_Top,
        Closed_Grid, Left_Top_Right],
//row8
    [Right_Bottom_Left, Left_Right, Left_Bottom, Bottom_Only, Right_Bottom,
        Left_Only, Top_Bottom, Empty_Grid, Bottom_Only, Top_Bottom,
        Bottom_Only, Empty_Grid, Top_Bottom, Bottom_Only, Bottom_Only,
        Top_Bottom, Right_Only],
//row9
    [Bottom_Left_Top, Bottom_Only, Top_Bottom, Top_Bottom, Top_Bottom,
        Right_Only, Left_Top_Right, Left_Right, Left_Top, Top_Bottom,
        Right_Top, Left_Right, Left_Top, Top_Bottom, Top_Bottom,
        Top_Right_Bottom, Left_Right],
//row10
    [Left_Top, Top_Only, Top_Only, Right_Top, Left_Top_Right,Left_Right,
        Left_Right, Left_Right, Left_Right, Left_Top_Right, Left_Right,
        Left_Right, Left_Right, Left_Top, Top_Only, Top_Only,
        Right_Only],
//row11
    [Left_Only, Empty_Grid, Empty_Grid, Right_Only, Right_Bottom_Left,
        Left_Right, Right_Bottom_Left, Left_Right, Left_Right, Left_Right,
        Left_Right, Left_Right, Left_Right, Left_Bottom, Bottom_Only,
        Bottom_Only, Right_Only],
//row12
    [Left_Only, Empty_Grid, Empty_Grid, Right_Only, Left_Top,
        Bottom_Only, Top_Only, Right_Bottom, Left_Right, Left_Right,
        Left_Right, Left_Right, Left_Only, Top_Only, Top_Bottom,
        Top_Right_Bottom, Left_Right],
//row13
    [Left_Only, Empty_Grid, Empty_Grid, Right_Only, Left_Right,
        Left_Top_Right, Left_Right, Bottom_Left_Top, Right_Bottom, Left_Right,
        Right_Bottom_Left, Left_Right, Left_Bottom, Right_Bottom, Left_Top,
        Top_Bottom, Right_Only],
//row14
    [Left_Only, Empty_Grid, Empty_Grid, Right_Only, Left_Right,
        Left_Right, Left_Bottom,Top_Only, Top_Bottom, Bottom_Only, Top_Only,
        Bottom_Only, Top_Bottom, Top_Bottom, Right_Bottom, Left_Top_Right,
        Left_Right],
//row15
    [Left_Only, Empty_Grid, Empty_Grid, Right_Only, Left_Right,
        Left_Only, Right_Top, Left_Right, Left_Top, Right_Top,
        Left_Right, Bottom_Left_Top,Top_Bottom, Top_Bottom, Top_Bottom,
        Right_Only, Left_Right],
//row16
    [Left_Only, Empty_Grid, Empty_Grid, Right_Only, Left_Right,
        Left_Bottom, Right_Bottom, Left_Right, Left_Bottom, Right_Bottom,
        Left_Only, Top_Bottom, Top_Bottom, Top_Bottom, Right_Top,
        Right_Bottom_Left, Left_Right],
//row17
    [Left_Bottom, Bottom_Only, Bottom_Only, Right_Bottom, Left_Bottom,
        Top_Bottom, Top_Bottom, Bottom_Only, Top_Bottom, Top_Bottom,
        Right_Bottom, Bottom_Left_Top, Top_Bottom, Top_Right_Bottom, Left_Bottom,
        Top_Bottom, Right_Bottom]
];

// grids that don't redraw
var staticGrids = [];
var staticGridsIndex = 0;


// start location of pacman
var pacmanStartLoc = [4,9];

// grids with no beans
var noBean = [pacmanStartLoc,[2,2],[3,3],[8,9],[1,6],[4,7],[5,8],[6,9],[5,10],[4,11],[3,9],[12,7],[6,15]];
var noBeanIndex=noBean.length;


// power beans in maze
var powerBeans = [[0,0], [2,13], [16,4], [16,16], [7,9],[2,5], [14,10]];


// ghost house
var ghostHouse = [];
var ghostHouseIndex = 0;
/*======================END GLOBAL VARs====================*/


/*====================Initialization Methods==============*/

function initCanvas(width, height){
    if(width===undefined || !(width instanceof Number)){
        width = Canvas_Width;
    }
    if(height===undefined || !(height instanceof Number)){
        height = Canvas_Height;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,Canvas_Width,Canvas_Height);
}

// draw maze, print instruction on lower-left corner, show lives on top-right corner
function initMaze(){
    for(var i=0; i<maze.length; i++){
        var oneRow = new Array(Canvas_Width/Grid_Width);
        maze[i] = oneRow;
    }

    // draw maze with full beans
    for( var row = 0; row < Canvas_Height/Grid_Height; row++){
        for(var col = 0; col < Canvas_Width/Grid_Width; col++){
            var beanType = Normal_Bean;
            var newGrid = new Grid(col*Grid_Width,row*Grid_Height , mazeContent[row][col],beanType);

            maze[row][col] = newGrid;
            newGrid.draw();
        }
    }

    //overwrite beans that shouldn't ecist
    for(var i=0; i<noBean.length; i++){
        var x = noBean[i][0];
        var y = noBean[i][1];
        maze[x][y].beanType = undefined;
        maze[x][y].draw();
    }

    // draw power beans
    for(var i=0; i<powerBeans.length;i++){
        var x = powerBeans[i][0];
        var y = powerBeans[i][1];
        maze[x][y].beanType = Power_Bean;
        maze[x][y].draw();
    }

}


function initFields () {
    // body...
    for (var i=9; i<13; i++){
        ghostHouse[ghostHouseIndex]=[i,9];
        ghostHouseIndex++;
    }


    //fill up staticGrids[]
    for (var i=0; i<2; i++){
        for (var j=8; j<17; j++){
            staticGrids[staticGridsIndex]=[i,j];
            staticGridsIndex++;
        }
    }
    for (var i=9; i<17; i++){
        for (var j=0; j<4; j++){
            staticGrids[staticGridsIndex]=[i,j];
            staticGridsIndex++;
        }
    }
    for (var i=2; i<6; i++){
        for (var j=14; j<17; j++){
            staticGrids[staticGridsIndex]=[i,j];
            staticGridsIndex++;
        }
    }

    //fill up noBean[]
    for(var i=0; i<2; i++){
        for(var j=8; j<17; j++){
            noBean[noBeanIndex]=[i,j];
            noBeanIndex++;
        }
    }
    for(var i=2; i<6; i++){
        for(var j=14; j<17; j++){
            noBean[noBeanIndex]=[i,j];
            noBeanIndex++;
        }
    }
    for(var i=9; i<17; i++){
        for(var j=0; j<4; j++){
            noBean[noBeanIndex]=[i,j];
            noBeanIndex++;
        }
    }
    for(var i=6; i<8;i++){
        for(var j=2;j<5;j++){
            noBean[noBeanIndex]=[i,j];
            noBeanIndex++;
        }
    }
    for(var i=14; i<16;i++){
        for(var j=8;j<10;j++){
            noBean[noBeanIndex]=[i,j];
            noBeanIndex++;
        }
    }
    for(var i=1; i<5;i++){
        noBean[noBeanIndex]=[i,1];
        noBeanIndex++;

    }
    for(var i=1; i<5;i++){
        noBean[noBeanIndex]=[i,4];
        noBeanIndex++;

    }
    for(var i=3; i<7;i++){
        noBean[noBeanIndex]=[i,6];
        noBeanIndex++;

    }
    for(var i=3; i<7;i++){
        noBean[noBeanIndex]=[i,12];
        noBeanIndex++;

    }
    for(var i=6; i<8;i++){
        noBean[noBeanIndex]=[i,0];
        noBeanIndex++;

    }
    for(var i=8; i<11;i++){
        noBean[noBeanIndex]=[i,6];
        noBeanIndex++;

    }
    for(var i=8; i<13;i++){
        noBean[noBeanIndex]=[i,8];
        noBeanIndex++;

    }
    for(var i=8; i<13;i++){
        noBean[noBeanIndex]=[i,10];
        noBeanIndex++;

    }
    for(var i=12; i<16;i++){
        noBean[noBeanIndex]=[i,5];
        noBeanIndex++;

    }
    for(var i=14; i<16;i++){
        noBean[noBeanIndex]=[i,6];
        noBeanIndex++;

    }
    for(var i=9; i<11;i++){
        noBean[noBeanIndex]=[i,4];
        noBeanIndex++;

    }
    for(var i=13; i<16;i++){
        noBean[noBeanIndex]=[i,15];
        noBeanIndex++;

    }
    for(var i=9; i<12;i++){
        noBean[noBeanIndex]=[i,12];
        noBeanIndex++;

    }
    for(var j=11; j<14;j++){
        noBean[noBeanIndex]=[16,j];
        noBeanIndex++;

    }
    for(var j=11; j<15;j++){
        noBean[noBeanIndex]=[14,j];
        noBeanIndex++;

    }
    for(var j=12; j<16;j++){
        noBean[noBeanIndex]=[8,j];
        noBeanIndex++;

    }
    for(var j=12; j<16;j++){
        noBean[noBeanIndex]=[11,j];
        noBeanIndex++;

    }
    for(var j=12; j<14;j++){
        noBean[noBeanIndex]=[12,j];
        noBeanIndex++;

    }

}
/*================END Initialization Methods==============*/


/*====================Util Methods================*/
//draw a circle
function circle(ctx, cx, cy, radius) {

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
    ctx.fill();

}

//get opposite direction
function oppositeDir (dir) {
    switch(dir){
        case Up:
            return Down;
            break;

        case Down:
            return Up;
            break;

        case Left:
            return Right;
            break;

        case Right:
            return Left;
            break;

        default:
            return -1;//err
    }
}

function getRowIndex (yCord) {
    if(yCord === undefined){
        return -1;//err
    }
    return parseInt(yCord/Grid_Height);
}


function getColIndex (xCord) {
    if(xCord === undefined){
        return -1;//err
    }
    return parseInt(xCord/Grid_Width);
}

function sleep(ms)
{
    var dt = new Date();
    dt.setTime(dt.getTime() + ms);
    while (new Date().getTime() < dt.getTime());
}

function fixGrids (x, y) {
    var row = getRowIndex(y);
    var col = getColIndex(x);

    if(xOnGridCenter(y)){
        maze[row][col].draw();
        if(col+1 < maze.length && !staticArrayContains([row, col+1])){
            maze[row][col+1].draw();
        }
        if(col-1 >= 0 && !staticArrayContains([row, col-1])){
            maze[row][col-1].draw();
        }
    }
    else if(yOnGridCenter(x)){
        maze[row][col].draw();
        if(row+1 < maze.length  && !staticArrayContains([row+1, col])){
            maze[row+1][col].draw();
        }
        if(row-1 >=0 && !staticArrayContains([row-1,col]) ){
            maze[row-1][col].draw();
        }
    }
}

function staticArrayContains(cord) {
    var x = cord[0];
    var y = cord[1];
    for(var i=0; i< staticGrids.length; i++ ){
        if(x=== staticGrids[i][0] &&
            y=== staticGrids[i][1]){
            return true;
        }
    }
    return false;
}

function ghostHouseContains(cord) {
    var x = cord[0];
    var y = cord[1];
    for(var i=0; i< ghostHouse.length; i++ ){
        if(x=== ghostHouse[i][0] &&
            y=== ghostHouse[i][1]){
            return true;
        }
    }
    return false;
}

function onGridCenter (x,y) {
    return xOnGridCenter(y) && yOnGridCenter(x);
}

function xOnGridCenter (y) {
    return ((y - Grid_Width/2) % Grid_Width) === 0;
}

function yOnGridCenter (x) {
    return ((x - Grid_Height/2) % Grid_Height) === 0;
}

//see if sprite can move one more step at the given (x,y) facing the given direction
function canMove (x,y,dir) {
    if(!onGridCenter(x,y)){
        return true;
    }
    var canMove = false;
    var currGrid = maze[getRowIndex(y)][getColIndex(x)];
    var gridType = currGrid.gridType;
    switch(dir){
        case Up:
            if(gridType != Left_Top && gridType != Right_Top && gridType != Top_Bottom
                && gridType != Top_Only && gridType!= Left_Top_Right
                && gridType != Top_Right_Bottom && gridType!= Bottom_Left_Top){
                canMove = true;
            }
            break;

        case Down:
            if(gridType != Left_Bottom && gridType != Top_Bottom && gridType != Right_Bottom
                && gridType != Bottom_Only && gridType!= Right_Bottom_Left
                && gridType != Bottom_Left_Top && gridType!= Top_Right_Bottom){
                canMove = true;
            }
            break;

        case Left:
            if(gridType != Left_Bottom && gridType != Left_Top && gridType != Left_Only
                && gridType != Left_Right && gridType!= Left_Top_Right
                && gridType != Bottom_Left_Top && gridType!= Right_Bottom_Left){
                canMove = true;
            }
            break;

        case Right:
            if(gridType != Right_Bottom && gridType != Right_Top && gridType != Right_Only
                && gridType != Left_Right && gridType!= Right_Bottom_Left
                && gridType != Top_Right_Bottom && gridType != Left_Top_Right){
                canMove = true;
            }
            break;
        default:
            break;


    }
    return canMove;
}
/*=================END Util Methods================*/


/*=================UI Update Methods===============*/

// draw instructions
function printInstruction () {
    ctx.fillStyle = "white";
    ctx.font="12px monospace";
    ctx.textAlign = "left";

    var txt = "WELCOME TO \nPACMAN!\n\n\nArrow keys or\nWASD to move\n\nQ to pause\nE to resume\nR to restart";
    var x = 12;
    var y = Canvas_Height-200;
    var lineheight = 15;
    var lines = txt.split('\n');

    for (var i = 0; i<lines.length; i++)
        ctx.fillText(lines[i], x, y + (i*lineheight) );

    if (ghosts.length === 0){
        ctx.fillStyle = "black";
        ctx.fillRect(x, Canvas_Width-40, 70, 30);
        ctx.fillStyle = "red";
        ctx.font = "16px monospace";
        ctx.textAlign = "left";
        ctx.fillText("GOD MODE", x, Canvas_Width-20);
    }

}

//draw lives on top-right corner
function showLives(){
    ctx.fillStyle="black";
    ctx.fillRect(Canvas_Width-80, 10, 70, 30);
    for(var i=0; i<life-1; i++){
        lives[i] = new Pacman(Canvas_Width-50+25*i, 30, Right);
        lives[i].draw();
    }

}

//show welcome screen
function welcomeScreen(){

    gameOn = false;
    gamePaused = false;
    // welcome text
    ctx.fillStyle = "white";
    ctx.font = "80px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PACMAN", Canvas_Width/2, 170);
    ctx.font = "20px monospace";
    ctx.fillText("Press s to start", Canvas_Width/2, 220);

    welcomePacman = new Pacman(Canvas_Width/5, Canvas_Height/3*2, Right);
    welcomePacman.radius = 30;
    welcomePacman.draw();

    welcomeBlinky = new Ghost(Canvas_Width/5*3.3, Canvas_Height/3*2, Red, Left);
    welcomeBlinky.radius = 30;
    welcomeBlinky.draw();

    welcomeInky = new Ghost(Canvas_Width/5*4, Canvas_Height/3*2, Cyan, Right);
    welcomeInky.radius = 30;
    welcomeInky.draw();
    Interval = setInterval(updateWelcomeScreen, timerDelay*2);
}

//welcome screen animation
function updateWelcomeScreen () {
    ctx.fillStyle = "black";
    ctx.fillRect(0, Canvas_Height/2, Canvas_Width,140);
    welcomePacman.mouthOpen = !welcomePacman.mouthOpen;
    welcomeBlinky.isMoving = !welcomeBlinky.isMoving;
    welcomeInky.isMoving = !welcomeInky.isMoving;
    welcomePacman.draw();
    welcomeInky.draw();
    welcomeBlinky.draw();
}


//show || update score
function showScore(){
    ctx.fillStyle="black";
    ctx.fillRect(Canvas_Width-250, 10, 190, 40);
    ctx.fillStyle = "white";
    ctx.font = "24px monospace";
    ctx.textAlign = "left";
    ctx.fillText("score: " + parseInt(score), Canvas_Width-250, 37);
}

//show win message
function winMessage(){
    //draw popup
    ctx.fillStyle = "black";
    ctx.strokeStyle = "green";
    ctx.lineWidth=5;
    ctx.fillRect(Canvas_Width/2-150, Canvas_Height/2-40, 300, 100);
    ctx.strokeRect(Canvas_Width/2-150, Canvas_Height/2-40, 300, 100);

    //write message
    ctx.textAlign="center";
    ctx.fillStyle = "white";
    ctx.font = "16px monospace";
    ctx.fillText("Congratulations, you won!", Canvas_Height/2, Canvas_Height/2+6);
    ctx.font = "12px monospace";
    ctx.fillText("press R to play again", Canvas_Height/2, Canvas_Height/2+28);
}

//show lose message
function loseMessage(){
    //draw popup
    ctx.fillStyle = "black";
    ctx.strokeStyle = "red";
    ctx.lineWidth=5;
    ctx.fillRect(Canvas_Width/2-100, Canvas_Height/2-40, 200, 100);
    ctx.strokeRect(Canvas_Width/2-100, Canvas_Height/2-40, 200, 100);

    //write message
    ctx.textAlign="center";
    ctx.fillStyle = "red";
    ctx.font = "26px monospace";
    ctx.fillText("GAME OVER", Canvas_Height/2, Canvas_Height/2+7);
    ctx.font = "12px monospace";
    ctx.fillText("press R to play again", Canvas_Height/2, Canvas_Height/2+28);
}

//update canvas for each frame. 
function updateCanvas() {
    restartTimer++;
    if (gameOver()===true){
        life--;
        // mrPacman.dieAnimation();
        showLives();
        if (life>0){
            sleep(500);
            clearInterval(Interval);
            fixGrids(mrPacman.x, mrPacman.y);
            for(var i=0; i<ghosts.length; i++){
                fixGrids(ghosts[i].x, ghosts[i].y);
            }
            run();
        }
        else {
            clearInterval(Interval);
            sleep(500);
            loseMessage();
        }

    }
    else if (pacmanWon()===true){
        clearInterval(Interval);
        sleep(500);
        winMessage();
    }
    else{
        if(weakCounter>0 && weakCounter<2000/timerDelay){
            for(var i=0; i<ghosts.length; i++){
                ghosts[i].isBlinking = !ghosts[i].isBlinking;
            }
        }
        if(weakCounter>0){
            weakCounter--;
        }
        if(weakCounter===0){
            for(var i=0; i<ghosts.length; i++){
                ghosts[i].isDead = false;
                ghosts[i].isWeak = false;
                ghosts[i.isBlinking = false];
                weakBonus= 200;
            }
        }

        eatBean();
        eatGhost();
        mrPacman.move();

        for(var i=0; i<ghosts.length; i++){
            if(ghosts[i].isDead === false){
                ghosts[i].move();
            }
        }

        fixGrids(mrPacman.x, mrPacman.y);
        for(var i=0; i<ghosts.length; i++){
            fixGrids(ghosts[i].x, ghosts[i].y);
        }

        mrPacman.draw();
        for(var i=0; i<ghosts.length; i++){
            ghosts[i].draw();
        }
    }
}

//try to eat a bean
function eatBean () {
    if(onGridCenter(mrPacman.x, mrPacman.y)){
        if(maze[mrPacman.getRow()][mrPacman.getCol()].beanType===Normal_Bean){
            score+= parseInt(10);
            showScore();
            beansLeft--;
        }
        else if (maze[mrPacman.getRow()][mrPacman.getCol()].beanType===Power_Bean){
            score+=parseInt(50);
            showScore();
            beansLeft--;

            //ghosts enter weak mode
            for(var i=0; i<ghosts.length; i++){
                ghosts[i].isWeak=true;
            }
            weakCounter=Weak_Duration;
        }
        maze[mrPacman.getRow()][mrPacman.getCol()].beanType=undefined;
        maze[mrPacman.getRow()][mrPacman.getCol()].draw();
    }
}

//try to eat a weak ghost
function eatGhost () {
    for(var i=0; i<ghosts.length; i++){
        if(Math.abs(mrPacman.x-ghosts[i].x)<=5 && Math.abs(mrPacman.y-ghosts[i].y)<=5
            && ghosts[i].isWeak && !ghosts[i].isDead){
            score += parseInt( weakBonus);
            weakBonus *=2;
            showScore();
            ghosts[i].isDead = true;
            ghosts[i].toGhostHouse();
        }
    }
}

function gameOver(){
    for(var i=0; i<ghosts.length; i++){
        if(Math.abs(mrPacman.x-ghosts[i].x)<=5 && Math.abs(mrPacman.y-ghosts[i].y)<=5
            && !ghosts[i].isWeak){
            return true;
        }
    }
    return false;
}

function pacmanWon(){
    return beansLeft === 0;
}

//Show a count down each time the game starts
function countDown () {
    ctx.fillStyle = "black";
    ctx.fillRect(Canvas_Height-85, 70, 80,80);
    ctx.fillStyle = "red";
    ctx.font = "50px monospace";
    ctx.textAlign = "center";
    ctx.fillText("3",Canvas_Height-43, 130);
    setTimeout(function () {
        ctx.fillStyle = "black";
        ctx.fillRect(Canvas_Height-85, 70, 80,80);
        ctx.fillStyle = "orange";
        ctx.fillText("2",Canvas_Height-43, 130);
        setTimeout(function  () {
            ctx.fillStyle = "black";
            ctx.fillRect(Canvas_Height-85, 70, 80,80);
            ctx.fillStyle = "yellow";
            ctx.fillText("1",Canvas_Height-43, 130);
            setTimeout(function  () {
                ctx.fillStyle = "black";
                ctx.fillRect(Canvas_Height-85, 70, 80,80);
                ctx.fillStyle = "green";
                ctx.textAlign = "center";
                ctx.fillText("GO",Canvas_Height-43, 130);
                setTimeout(function  () {
                    Interval = setInterval(updateCanvas, timerDelay);
                },500);
            }, 1000);
        }, 1000);
    }, 1000);
}
/*==================END UI Update Methods================*/


/*==================Game Control Methods===================*/
//listen to keyDown event
function onKeyDown (event) {
    var keycode = event.keyCode;
    var pauseCode = 81; //q to pause
    var continueCode = 69; //e to resume
    var restartCode = 82; //r to restart
    var godModeCode = 71; //g to enter god mode

    // wasd
    var wCode = 87;
    var aCode = 65;
    var sCode = 83;
    var dCode = 68;
    //arrow keys
    var leftCode = 37;
    var upCode = 38;
    var rightCode = 39;
    var downCode = 40;

    //start game
    if(!gameOn){
        if(keycode === sCode){
            clearInterval(Interval);
            gameOn = true;
            gamePaused = false;
            initMaze();
            run();
            return;
        }
        else if(keycode === godModeCode){
            clearInterval(Interval);
            ghosts = [];
            gameOn = true;
            gamePaused = false;
            initMaze();
            run(true);
            return;
        }
    }
    else{

        //pause game
        if(keycode === pauseCode && !gamePaused){
            clearInterval(Interval);
            gamePaused = true;
            return;
        }

        //resume game
        if(keycode === continueCode && gamePaused){
            Interval = setInterval(updateCanvas, timerDelay);
            gamePaused = false;
            return;
        }

        //restart game
        if( keycode === restartCode && restartTimer > 0) {
            //can't restart game if a game was just refreshed.
            restartTimer = 0;
            clearInterval(Interval);
            gameOn = true;
            gamePaused = false;
            score = 0;
            life = Max_Life;
            beansLeft = Max_Beans;
            initMaze();
            run();
        }

        //4-way controls
        switch(keycode){
            case upCode:
            case wCode:
                mrPacman.nextDir = mrPacman.dir===Up ? undefined: Up;
                break;

            case rightCode:
            case dCode:
                mrPacman.nextDir = mrPacman.dir===Right? undefined : Right;
                break;

            case leftCode:
            case aCode:
                mrPacman.nextDir = mrPacman.dir === Left? undefined : Left;
                break;

            case downCode:
            case sCode:
                mrPacman.nextDir = mrPacman.dir === Down? undefined : Down;
                break;

            default:
                break;

        }
    }
}

//run the game. Create mrPacman and 4 ghosts. Reset their positions.
function run(isGodMode) {
    showScore();

    mrPacman = new Pacman(pacmanStartLoc[1]*Grid_Width + Grid_Width/2, pacmanStartLoc[0]*Grid_Height + Grid_Height/2, Right);
    if(isGodMode===undefined || !isGodMode){
        blinky = new Ghost(0,0, Red, Down);
        inky = new Ghost(0,0, Cyan, Down);
        pinky = new Ghost(0,0, Pink, Down);
        clyde = new Ghost(0,0, Orange, Down);

        blinky.toGhostHouse();
        inky.toGhostHouse();
        pinky.toGhostHouse();
        clyde.toGhostHouse();

        ghosts = [blinky, inky, pinky, clyde];

        inky.draw();
        blinky.draw();
        pinky.draw();
        clyde.draw();
    }
    else{
        ghosts = [];
    }
    showLives();
    printInstruction();

    mrPacman.draw();
    countDown();
}
/*===============END Game Control Methods===================*/



/*-----------GAME START-----------*/
initFields();
initCanvas(Canvas_Width, Canvas_Height);
canvas.addEventListener('keydown', onKeyDown, false);
canvas.setAttribute('tabindex','0');
canvas.focus();
welcomeScreen();


