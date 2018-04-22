/* #TODO mouse functionality */

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

        if(this.value >= grid.delimeter && this.timer>=0){
            ctx.fillStyle = "#03ff13";
        }
        else if(this.timer<0 && this.value >= grid.delimeter){
            ctx.fillStyle = "#ff142d";
        }
        else{
            ctx.fillStyle = "#767676";
        }
        ctx.fillRect(this.x,this.y,grid.getSingleWidth(),grid.getSingleHeight());

        if(this.value >= grid.delimeter){
            ctx.fillStyle = "black";
            ctx.font = "15px Arial";
            ctx.fillText(this.timer,this.x+grid.getSingleWidth()/2,this.y+grid.getSingleHeight()/2);
        }
    };

    doesInterfereWithBall(ball){
        return (Math.abs(ball.x-(this.x+Game.grid.getSingleHeight()/2)) <= ball.r*2) &&
            (Math.abs(ball.y-(this.y+Game.grid.getSingleWidth()/2)) <= ball.r*2)
    }
};

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

    renderRandomPoint(free){
        console.log(free);
        for(let a in Array.from({length: free}, (e,i) => i)) {

            let randX = Math.floor(Math.random()*this.fields);
            let randY = Math.floor(Math.random()*this.fields);

            while(this.grid[randX][randY].value >= this.delimeter && this.grid[randX][randY].timer > 0){
                randX = Math.floor(Math.random()*this.fields);
                randY = Math.floor(Math.random()*this.fields);
            }

            this.grid[randX][randY].value = this.delimeter+1;
            this.grid[randX][randY].timer = 20;
        }
    }

    checkGamePoints(){
        const renderedFields = this.getRenderedFields();

        if(renderedFields<= Math.sqrt(this.fields)){
            this.renderRandomPoint(Math.pow(this.fields,2) - renderedFields);
        }
    }

    getRenderedFields(){

        return this.grid.reduce(
            (prev,current) => prev.concat(current),[]).reduce((e,i) => { /* prob not working */
                if(i.value >= this.delimeter && i.timer >= 0)
                    return 1;
                else{
                    return 0;
                }
                },0);
    }
};

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
        ctx.fillStyle = "#000";
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
        Game.grid.grid.reduce((e,a) => e.concat(a),[]).forEach(
            (element) => {
                if(element.doesInterfereWithBall(Game.ball) && element.value>=Game.grid.delimeter){
                    element.value = -1;
                    Game.points += element.timer;

                    Game.grid.checkGamePoints();
                }
        });
        Game.grid.drawWholeGrid();
        this.renderBall();
    }
};

const Buttons = class {
    constructor(r,l,u,d){
        this.right = r;
        this.left = l;
        this.up = u;
        this.down = d;
    }
};

const Player = class {
    constructor(name){
        this.name = name;
        this.points = [];
        this.round = 0;
    }

    addRoundToResult(){
        this.points.push(Game.points);
        this.round += 1;
        Game.points = 0;
    }

    displayPoints(){
        this.points.reduce( (e,i) => {
            return `${e} ${i}`;
        },'')
    }
};

const setupButtons = () => {
    document.addEventListener("keydown",keyDownHandler);
};

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
};

const updatePoints = () => {
    document.getElementsByClassName("points")[0].innerHTML = Game.points;
};

const Game = {
    grid: -1,
    buttons: new Buttons(false,false,false,false),
    ball: -1,
    interval_id: 0,
    points: 0,
    currentPlayer: -1,
};

const setupGame = (N,velocity_x,velocity_y) => {
    Game.grid = new Grid(600,600,N);
    Game.ball = new Ball(300,300,10,velocity_x,velocity_y);

    setupButtons();
    Game.grid.drawWholeGrid();
    Game.ball.renderBall();
    Game.points = 0;

    Game.interval_id = window.setInterval( () => {
        Game.grid.grid.reduce((e,a)=>e.concat(a),[]).forEach(
            (element) => {
                element.timer -=1;
            }
        );

        Game.grid.drawWholeGrid();
        Game.ball.renderBall();
        updatePoints();
    },1000)
};

const renderResultTable = () => {
    document.getElementsByClassName("fixed-table-body").innerHTML +=
        `<tr>
            <td>${Game.currentPlayer.name}</td>
            <td>${Game.currentPlayer.displayPoints()}</td>
        </tr>`
};

const renderNextRound = () => {
    if(Game.currentPlayer !== -1){
        Game.currentPlayer.addRoundToResult();
        if(Game.currentPlayer.round < 3){
            setupGame(Game.grid.fields*2,Game.ball.v_x*2,Game.ball.v_y*2);
        }
        else{
            renderResultTable();
        }
    }
};

const newGame = () => {
    if(Game.grid === -1){
        Game.currentPlayer = new Player(
            document.getElementsByClassName("input")[0].value
            );
        setupGame(
            parseInt(document.getElementsByClassName("input")[1].value),
            parseFloat(document.getElementsByClassName("input")[2].value),
            parseFloat(document.getElementsByClassName("input")[2].value)
        );
    }
};



