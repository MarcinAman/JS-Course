data = {
    diagram_items:{},
    width:600,
    height:600,
    font_size:15,
    lower_gap:30
};

data.diagram_items = new Map();

var colors = ['red', 'green', 'blue', 'orange', 'yellow','grey','pink'];

document.getElementById("collect_data").addEventListener('click',collect_data);

function clear_canvas(){
    var ctx = document.getElementById("diagram").getContext("2d");
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0,0,data.width,data.height);
}

function draw_bar(x,y,w,h,text){
    var ctx = document.getElementById("diagram").getContext("2d");
    //text starts at x,0
    ctx.fillStyle = "black";
    ctx.font = data.font_size+"px Arial";
    ctx.fillText(text,x,data.height-data.font_size,w);
    ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
    ctx.fillRect(x,data.height-y,w,-h);
}

function collect_data(){
    clear_canvas();
    document.getElementById("textarea").value.split(" ").filter(a=>a!=='').forEach(function (value) {
        var hash_value = 0;
        if(data.diagram_items.has(value)){
            hash_value = data.diagram_items.get(value);
            data.diagram_items.delete(value);
        }
        data.diagram_items.set(value,hash_value+1);
    });
    console.log(data.diagram_items);
    draw_grid();
}

function get_max_repetitions(){
    var max = 0;
    for(var value of data.diagram_items.values()){
        if(max<value) max = value;
    }
    return max;
}


function draw_grid() {
    var x = (data.width / data.diagram_items.size);
    var index = 0;
    var max_repetitions = get_max_repetitions();
    var w = data.width/(1.1*data.diagram_items.size+0.1);
    for (var [key, value] of data.diagram_items.entries()) {
        draw_bar(x*index, data.lower_gap, w, 0.90*data.width* value / max_repetitions,key);
        index++;
    }

}



