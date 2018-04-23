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
        for(let x in Array.from({length: free},(m,n)=>n)){
            let rand = Math.floor(Math.random()*free);
            let iterator = 0;
            for(let a in Array.from({length: this.fields},(e,i)=> i)){
                for(let b in Array.from({length: this.fields},(j,k)=>k)){
                    if(this.grid[a][b].value >= this.delimeter && this.grid[a][b].timer>=-5){
                        iterator++;
                    }
                    else if(rand===iterator){
                        this.grid[a][b].value = this.delimeter+1;
                        this.grid[a][b].timer = 20;
                        rand = -2;
                    }
                }
            }
        }
    }

    checkGamePoints(){
        const renderedFields = this.getRenderedFields();

        if(renderedFields <= this.fields){
            this.renderRandomPoint(this.fields*this.fields - renderedFields);
        }
    }

    getRenderedFields(){

        return this.grid.reduce(
            (prev,current) => prev.concat(current),[]).reduce((e,i) => { /* prob not working */
                if(i.value >= this.delimeter && i.timer >= 0)
                    return 1+e;
                else{
                    return e;
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

        if(this.x<=0){
            this.x = (600-this.r*2);
        }
        if(this.x>=600){
            this.x = this.r*2
        }

        if(this.y<=0){
            this.y = (600-this.r*2)
        }
        if(this.y>=600){
            this.y = this.r*2;
        }

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
                }
        });
        Game.grid.checkGamePoints();
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
        return this.points.reduce( (e,i) => {
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
    document.getElementsByClassName("time")[0].innerHTML = 60-Game.time;
};

const Game = {
    grid: -1,
    buttons: new Buttons(false,false,false,false),
    ball: -1,
    interval_id: 0,
    points: 0,
    currentPlayer: -1,
    time: 0
};

const mouseMoveHandler = (e) => {
  const relativeX = e.clientX - document.getElementById("game-canvas").offsetLeft;
  const relativeY = e.clientY - document.getElementById("game-canvas").offsetTop;

  let cond = 0;
  if(relativeX>0 && relativeX<600){
    Game.ball.x += Game.ball.v_x*2*((relativeX-300)/600);
    cond = 1;
  }
  if(relativeY>0 && relativeY<600){
    Game.ball.y += Game.ball.v_y*2*((relativeY-300)/600);
    cond = 1;
  }

  if(cond){
      Game.grid.clearGrid();
      Game.grid.grid.reduce((e,a) => e.concat(a),[]).forEach(
          (element) => {
              if(element.doesInterfereWithBall(Game.ball) && element.value>=Game.grid.delimeter){
                  element.value = -1;
                  Game.points += element.timer;
                  }
          });
      Game.grid.drawWholeGrid();
      Game.ball.renderBall();
  }
};

const setupGame = (N,velocity_x,velocity_y,mouse) => {

    if(mouse) document.addEventListener('mousemove',mouseMoveHandler,false);

    Game.grid = new Grid(600,600,N);
    Game.ball = new Ball(300,300,10,velocity_x,velocity_y);
    Game.time = 0;

    setupButtons();
    Game.grid.drawWholeGrid();
    Game.ball.renderBall();
    Game.points = 0;

    Game.interval_id = window.setInterval( () => {
        Game.grid.grid.reduce((e,a)=>e.concat(a),[]).forEach(
            (element) => {
                if(element.value >= Game.grid.delimeter){
                    element.timer -=1;
                }
                if(element.timer < -5) {
                    element.value = -1;
                    element.timer = 20;
                }
            }
        );

        Game.grid.drawWholeGrid();
        Game.ball.renderBall();
        Game.time +=1;
        updatePoints();
        if(Game.time>=60){
            clearInterval(Game.interval_id);
        }
    },1000)
};

const renderResultTable = () => {
    document.getElementById("ranking").innerHTML += (Game.currentPlayer.name +": "+Game.currentPlayer.displayPoints()+"<br>");
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
    Game.currentPlayer = new Player(
        document.getElementsByClassName("input")[0].value
    );

    setupGame(
        parseInt(document.getElementsByClassName("input")[1].value),
        parseFloat(document.getElementsByClassName("input")[2].value),
        parseFloat(document.getElementsByClassName("input")[2].value),
        document.getElementsByClassName("input")[3].checked
    );
};



