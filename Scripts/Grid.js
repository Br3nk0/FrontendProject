var id = -1;

//wall cases
var Cross_Rd = -1;//no wall
var Left_Only = 0;
var Top_Only = 1;
var Right_Only = 2;
var Bottom_Only = 3;

var Left_Right = 4;
var Left_Top = 5;
var Left_Bottom = 6;

var Right_Top = 7;
var Right_Bottom = 8;
var Top_Bottom = 9;

var Bottom_Left_Top = 10;
var Left_Top_Right = 11;
var Top_Right_Bottom = 12;
var Right_Bottom_Left = 13;

var Empty_Grid = 14;
var Closed_Grid = 15;



function Grid (xCord, yCord, gridType, beanType) {
    this.x = xCord;
    this.y = yCord;
    this.gridType = gridType===undefined? Empty_Grid : gridType;
    this.beanType = beanType;
}

Grid.prototype.getRow = function() {
    return getRowIndex(this.y);
};

Grid.prototype.getCol = function() {
    return getColIndex(this.x);
};

Grid.prototype.hasBean = true;


Grid.prototype.toString = function() {
    return "Grid ("+this.x+","+this.y+") - Grid Type: " + this.gridType;
};



Grid.prototype.draw = function() {
    ctx.fillStyle = Bg_Color;
    ctx.fillRect(this.x, this.y, Grid_Width, Grid_Height);
    var gridType = this.gridType	;
    if(gridType === undefined || gridType === Empty_Grid){
        this.drawBean();
        return;
    }

    switch(gridType){

        case Left_Only:
            this.addLeftEdge();
            break;

        case Right_Only:
            this.addRightEdge();
            break;

        case Top_Only:
            this.addTopEdge();
            break;

        case Bottom_Only:
            this.addBottomEdge();
            break;

        case Left_Right:
            this.addLeftEdge();
            this.addRightEdge();
            break;

        case Left_Top:
            this.addLeftEdge();
            this.addTopEdge();
            break;

        case Left_Bottom:
            this.addLeftEdge();
            this.addBottomEdge();
            break;

        case Right_Top:
            this.addRightEdge();
            this.addTopEdge();
            break;

        case Right_Bottom:
            this.addRightEdge();
            this.addBottomEdge();
            break;

        case Top_Bottom:
            this.addTopEdge();
            this.addBottomEdge();
            break;

        case Cross_Rd:
            this.makeCrossRoad();
            break;

        case Left_Top_Right:
            this.addLeftEdge();
            this.addTopEdge();
            this.addRightEdge();
            break;

        case Top_Right_Bottom:
            this.addTopEdge();
            this.addRightEdge();
            this.addBottomEdge();
            break;

        case Right_Bottom_Left:
            this.addRightEdge();
            this.addBottomEdge();
            this.addLeftEdge();
            break;

        case Bottom_Left_Top:
            this.addBottomEdge();
            this.addLeftEdge();
            this.addTopEdge();
            break;

        case Closed_Grid:
            this.addLeftEdge();
            this.addTopEdge();
            this.addBottomEdge();
            this.addRightEdge();
            break;

        default:
            break;
    }
    this.drawBean();
};

Grid.prototype.addLeftEdge = function() {
    ctx.fillStyle = Border_Color;
    ctx.fillRect(this.x, this.y, Wall_Width, Grid_Height);
};

Grid.prototype.addRightEdge = function() {
    ctx.fillStyle = Border_Color;
    ctx.fillRect(this.x+Grid_Width - Wall_Width , this.y, Wall_Width , Grid_Height);
};

Grid.prototype.addTopEdge = function() {
    ctx.fillStyle = Border_Color;
    ctx.fillRect(this.x, this.y, Grid_Width, Wall_Width);
};

Grid.prototype.addBottomEdge = function() {
    ctx.fillStyle = Border_Color;
    ctx.fillRect(this.x, this.y + Grid_Height - Wall_Width, Grid_Width, Wall_Width);
};

Grid.prototype.makeCrossRoad = function() {
    ctx.fillStyle = Border_Color;
    ctx.fillRect(this.x, this.y, Wall_Width, Wall_Width);
    ctx.fillRect(this.x + Grid_Width - Wall_Width, this.y, Wall_Width, Wall_Width);
    ctx.fillRect(this.x, this.y + Grid_Height - Wall_Width, Wall_Width, Wall_Width);
    ctx.fillRect(this.x + Grid_Width - Wall_Width, this.y + Grid_Height - Wall_Width, Wall_Width, Wall_Width);

};


//draw a bean at the center of this grid
Grid.prototype.drawBean = function() {
    var beanType = this.beanType;
    var centerX = this.x + Grid_Width/2;
    var centerY = this.y + Grid_Height/2;

    ctx.fillStyle = Bean_Color;
    if(beanType === undefined){
        return;
    }

    if(beanType === Normal_Bean){
        circle(ctx, centerX, centerY, Normal_Bean_Radius);
    }
    else if(beanType === Power_Bean){
        circle(ctx, centerX, centerY, Power_Bean_Radius);
    }
    else{
        //unkwon bean type
        return;
    }

};