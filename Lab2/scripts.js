data = {
    words:"",
    words_found:0,
    words_same_len:0,
    word_len:0,
    width:600,
    height:600
};

var colors = ['red', 'green', 'blue', 'orange', 'yellow'];

window.onload = test;

function clear_canvas(){
    var ctx = document.getElementById("diagram").getContext("2d");
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0,0,data.width,data.height);
}

function draw_bar(x,y,w,h){
    var ctx = document.getElementById("diagram").getContext("2d");
    ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
    ctx.fillRect(x,data.height-y,w,-h);
}

function collect_data(){
    var element_to_search = document.getElementsByName("small_input")[0].value;
    var element_len = document.getElementsByName("small_input")[1].value;



}

function test(){
    clear_canvas();

    draw_bar(10,10,100,100);
}



