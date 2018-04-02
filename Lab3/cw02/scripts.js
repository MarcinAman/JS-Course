document.getElementById("setButton").addEventListener('click',function () {
    if(!document.getElementById("mainDiv").hasAttribute("class")){
        document.getElementById("mainDiv").setAttribute("class","website");
    }
    console.log(document.getElementById("mainDiv"));
});

document.getElementById("resetButton").addEventListener('click',function () {

    if(document.getElementById("mainDiv").hasAttribute("class")){
        document.getElementById("mainDiv").removeAttribute("class");
    }
    console.log(document.getElementById("mainDiv"));
});