data = {
    diagram_items:{},
    width:600,
    height:600,
    font_size:15,
    lower_gap:20,
};

data.diagram_items = new Map();

var colors = ['red', 'green', 'blue', 'orange', 'yellow','grey','pink','purple'];

document.getElementById("collect_data").addEventListener('click',function(){
    document.getElementById("textarea").value.split("\n").forEach(function(element){

        var element_contains = element.split(":");
        var word = element_contains[0].substr(element_contains[0].indexOf(" "),element_contains[0].length);

        if(element.startsWith("+")){
            var current_items = data.diagram_items.get(word);
            var total_list = [];
            if(data.diagram_items.has(word)){
                total_list = current_items.concat(element_contains[1].split(" "));
            }
            else{
                total_list = element_contains[1].split(" ");
            }
            data.diagram_items.set(word,total_list.filter(a=>a!==""));
        }
        else if(element.startsWith("-")){
            data.diagram_items.delete(word);
        }
        else{
            data.diagram_items.set(word,element_contains[1].split(" ").filter(a=>a!==""));
        }

        draw_graph(0);
    });

});

function clear_canvas(){
    var ctx = document.getElementById("diagram").getContext("2d");
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0,0,data.width,data.height);
}

function draw_bar(x,y,w,h){
    var ctx = document.getElementById("diagram").getContext("2d");
    ctx.fillStyle = colors[Math.random()%colors.length];
    ctx.fillRect(x,y+w,w,h);
    console.log("x: "+x+" y: "+y+w+" h:"+h+" w: "+w);
}

/*
function compare(a,b){
    if(a && b){
        return a[1].length > b[1].length;
    }
    return false;
}

function get_top_array(){
    var array = [];
    data.diagram_items.forEach(a=>array.push(a));

    return array.sort(compare);
}
*/

function get_max_value(){
    var max = -1;

    data.diagram_items.forEach(function (element) {
       if(element[0].length>max){
           max = element[0].length;
       }
    });

    return max;
}

function draw_graph(N){

    console.log(data.diagram_items);

    clear_canvas();

    var coord_x = 30;
    var coord_y = 10;

    var h = (data.width - coord_x)*0.9/get_max_value();
    var w = (data.height - coord_y)/data.diagram_items.size;
    console.log("w="+w);
    console.log("Max val: "+get_max_value());
    data.diagram_items.forEach(function(element){
        draw_bar(coord_x,coord_y,w*element[0].length,h);
        coord_y += h;
        coord_y += data.lower_gap;
    });
}


