const fs = require('fs');

exports.getPath = (input) => {
    if(fs.existsSync(__dirname.concat(input)) && 
        fs.statSync(__dirname.concat(input),(e,i)=> i).isFile()){
            return "File:\n".concat(fs.readFileSync(__dirname.concat(input)).toString());
    }
    else if(fs.existsSync(__dirname.concat(input)) && 
        fs.statSync(__dirname.concat(input),(e,i)=> i).isDirectory()){
            return "Catalog\n";
    }
}