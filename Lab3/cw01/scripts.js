data = {
    intervalID:0,
    timeoutID:0,
    requestID:0,
    timeFunInterval:0,
    timeFunTimeout:0,
    timeFunRequest:0,
    time_default:1
};

var start_interval;
var start_request;
var start_timeout;

document.getElementById("StartButton").addEventListener('click',function () {
    start_interval = new Date().getTime();
    data.intervalID = window.setInterval(funInterval,data.time_default*100);
    /*
        czasy sa mniej wiecej takie same z dokladnoscia do +/- 1 ms
    */
    start_timeout = new Date().getTime();
    data.timeoutID = window.setTimeout(funTimeout,data.time_default*100);
    start_request = new Date().getTime();
    data.requestID = window.requestAnimationFrame(funRequest);
});

document.getElementById("EndButton").addEventListener('click',function () {
   clearInterval(data.intervalID);
   window.clearTimeout(data.timeoutID);
   window.cancelAnimationFrame(data.requestID);
});

function funInterval(){
    var end = new Date().getTime();
    data.timeFunInterval = end-start_interval;
    console.log("funInterval: "+data.timeFunInterval);
    start_interval = new Date().getTime();
}

function funTimeout(){
    var end = new Date().getTime();
    data.timeFunTimeout = end-start_timeout;
    console.log("funTimeout: "+data.timeFunTimeout);
    start_timeout = new Date().getTime();
    data.timeoutID = window.setTimeout(funTimeout,data.time_default*100);
}

function funRequest(){
    var end = new Date().getTime();
    data.timeFunRequest = end-start_request;
    console.log("funRequest "+data.timeFunRequest);

    /* od 11 do 19 ms, co daje okolo 50-60 fps.
    Czyli zgodnie z manualem mniej wiecej czestotliwosc odswiezania po stronie Klienta */

    start_request = new Date().getTime();
    data.requestID = window.requestAnimationFrame(funRequest);
}
