const express = require('express')
const xml = require('xml');
const http = require ("http");
const url = require ("url");

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const getPair = () => ({x: Math.floor(Math.random()*400),y:Math.floor(Math.random()*400)})

app.get('/*', (req,res) => {
    const url_parts = url.parse (req.url, true);
    const N = parseInt(url_parts.pathname.substring(1,url_parts.pathname.length));

    returned = {
        points: Array.from({length: N}, () => getPair()),
        color: 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')'
    }
    res.send(JSON.stringify(returned));
})

app.listen(8080, function () {
    //quality content
});