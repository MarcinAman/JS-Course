const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
    if(fs.existsSync(__dirname.concat(input)) && 
        fs.statSync(__dirname.concat(input),(e,i)=> i).isFile()){
            rl.write("File:\n".concat(fs.readFileSync(__dirname.concat(input)).toString()));
    }
    else if(fs.existsSync(__dirname.concat(input)) && 
        fs.statSync(__dirname.concat(input),(e,i)=> i).isDirectory()){
            rl.write("Catalog\n");
    }
    rl.close();
});