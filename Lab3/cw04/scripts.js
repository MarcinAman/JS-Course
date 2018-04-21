const Rectangle = class {

    constructor(x,y,value,r){
        this.x = x;
        this.y = y;
        this.value = value;
        this.timer = 20;
        this.r = r; /* used only for collision comparision */
    }

    drawRectange(grid){
        const ctx = document.getElementById("game-canvas").getContext("2d");

        if(this.value >= grid.delimeter){
            ctx.fillStyle = "#03ff13";
        }
        else{
            ctx.fillStyle = "#FF0000";
        }
        ctx.fillRect(this.x,this.y,grid.getSingleWidth(),grid.getSingleHeight());
    };

    doesInterfereWithBall(ball){
        return (Math.abs(ball.x-this.x) <= ball.r+this.r) || (Math.abs(ball.y-this.y) <= ball.r+this.r)
    }
}

const Grid = class {
    constructor(width,height,fields){
        this.width = width;
        this.height = height;
        this.fields = fields;
        this.delimeter = this.generateRandomGreens();
        this.grid = Array.from({length: fields},
                    (x,i) => Array.from({length: fields},
                        (x,j) => new Rectangle(
                            i*this.width/this.fields,
                            j*this.height/this.fields,
                            Math.random()*fields,
                            this.width/this.fields
                        )));
    }

    /*if a number is lower than this it is Red, otherwise Green */

    generateRandomGreens(){
        return Math.random()*this.fields
    };


    getSingleWidth(){
        return this.width/this.fields
    }

    getSingleHeight(){
        return this.height/this.fields
    }

    clearGrid(){
        document.getElementById("game-canvas").getContext("2d").fillRect(0,0,this.width,this.height);
    }

    drawWholeGrid(){
        this.clearGrid();

        this.grid.forEach((array,X) => {
            array.forEach((element,Y) => {
                element.drawRectange(this);
            })
        })
    }
}

const Ball = class{
    constructor(x,y,r,v_x,v_y){
        this.r = r;
        this.x = x;
        this.y = y;
        this.v_x = v_x; /* velocity */
        this.v_y = v_y;
    }

    renderBall(){
        const ctx = document.getElementById("game-canvas").getContext("2d");
        ctx.fillStyle = "#000"
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2,false);
        ctx.fill();
    }


    updateVelocity(userInput){
        if(
            Object.keys(userInput).reduce(
            (result,current)=> {
                return userInput[result] && userInput[current];
            }
            )
        ){
            return;
        }
        else if(userInput.right){
            this.x += 10;
        }
        else if(userInput.left){
            this.x -= 10;
        }
        else if(userInput.up){
            this.y -= 10;
        }
        else{
            this.y += 10;
        }
        Game.grid.clearGrid();
        Game.grid.drawWholeGrid();
        this.renderBall();
    }
}

const Buttons = class {
    constructor(r,l,u,d){
        this.right = r;
        this.left = l;
        this.up = u;
        this.down = d;
    }
}

const setupButtons = () => {
    document.addEventListener("keydown",keyDownHandler);
}

const keyDownHandler = (e) => {
    if(e.key === "ArrowRight") {
        Game.buttons.right = true;
    }
    else if(e.key === "ArrowLeft") {
        Game.buttons.left = true;
    }
    else if(e.key === "ArrowUp"){
        Game.buttons.up = true;
    }
    else if(e.key === "ArrowDown"){
        Game.buttons.down = true;
    }
    Game.ball.updateVelocity(Game.buttons);

    Object.keys(Game.buttons).forEach(
        (element) => {
            Game.buttons[element] = false;
    });
}

const Game = {
    grid: new Grid(600,600,10),
    buttons: new Buttons(false,false,false,false),
    ball: new Ball(300,300,30,0),
}

window.onload = () => {
    setupButtons();
    Game.grid.drawWholeGrid();
    Game.ball.renderBall();
}


