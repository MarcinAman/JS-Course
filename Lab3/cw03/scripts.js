var value_dec;

window.onload = function(){
    document.getElementById("input_number").value = 10;
    value_dec = document.getElementById("input_number").value;
};

var intervalID = window.setInterval(function () {
    value_dec = document.getElementById("input_number").value-1;
    if(value_dec === -1){
        console.log("some code");
    }else{
        document.querySelectorAll("span").forEach(function(elem){
            elem.textContent = value_dec.toString();
        });
        value_dec-=1;
    }
    document.getElementById("input_number").value = (value_dec+1);
},2000);