const express = require('express')

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const operators = ['+','-','/','*']


app.get('/', (req,res) => {
    const n1 = Math.random()*100;
    const n2 = Math.random()*100;
    const opp = operators[Math.floor(Math.random()*operators.length)];
    res.send(n1.toFixed(0).toString()+opp+n2.toFixed(0).toString());
})

app.listen(8080, function () {
    //quality content
});