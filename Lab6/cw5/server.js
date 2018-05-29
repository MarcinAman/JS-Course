const express = require('express')

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/', (req,res) => {
    res.send(JSON.stringify(
        {
            x: Math.floor(Math.random()*400),
            y: Math.floor(Math.random()*400),
            color: 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')'
        }
    ))
})

app.listen(8080, function () {
    //quality content
});