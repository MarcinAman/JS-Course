// console.log('\x1B[31mWitaj Świecie\x1B[0m\n');

const modul = require('./test/modul');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.question("What u want to sum?",(input)=>{
    const intput_splitted = input.split(' ');
    console.log(modul.suma(parseInt(intput_splitted[0]),parseInt(intput_splitted[1])));
})