data = {
    diagram_items:{},
    width:600,
    height:600,
    font_size:15,
    left_gap:30,
    between_gap: 10
};

data.diagram_items = new Map();

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
    });

    draw_graph(parseInt(document.getElementById("BarAmount").value));
});

document.getElementById("refresh_diagram").addEventListener('click',function(){
  draw_graph(parseInt(document.getElementById("BarAmount").value));
});

function compare(a,b){
    if(a && b){
        return a[1].length < b[1].length;
    }
    return false;
}

function get_top_array(){
    var array = [];

    for(const entry of data.diagram_items){
        /*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator */
        array.push(entry);
    }

    return array.sort(compare);
}

/*Drawing part: */

function getRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function clear_canvas(){
    var ctx = document.getElementById("diagram").getContext("2d");
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0,0,data.width,data.height);
}

function draw_bar(x,y,w,h,text,number){
    /* drawing rotated text:*/
    var ctx = document.getElementById("diagram").getContext("2d");

    /* scale text */

    while(ctx.measureText(text).width>=h){
        text = text.substr(0,text.length-2);
    }

    /*draw and rotate */

    ctx.fillStyle = "black";
    ctx.font = data.font_size+ "px Arial";

    ctx.save();

    ctx.translate(0,0);
    ctx.rotate(Math.PI/2);
    ctx.fillText(text,y+(h-ctx.measureText(text).width)/2,-(data.left_gap-data.font_size)/2);

    ctx.restore();

    /* draw bar: */
    ctx.save();

    ctx.fillStyle = getRndColor();
    ctx.fillRect(x,y,w,h);

    ctx.restore();

    /* draw number */

    ctx.fillText(number,x+w+5,y+h/2);

}

function draw_graph(N){

    clear_canvas();

    /* Starting parameters: */
    var coord_x = data.left_gap;
    var coord_y = data.between_gap;
    var times = Math.min(N,data.diagram_items.size);

    var h = (data.height - coord_y)/times;

    var array = get_top_array();

    for(var i =0;i<times;i++){

        draw_bar(   coord_x,
                    coord_y+i*h,
                    0.9*(data.width-coord_x)*array[i][1].length/array[0][1].length,
                    h-10,
                    array[i][0],
                    array[i][1].length
                );
    }

}
