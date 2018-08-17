let fs = require('fs');
let endpoint = process.env['SAURON_ENDPOINT'];
let fileContent = "";
if (endpoint) {
    fileContent = 'var SAURON_API_URL = "' + endpoint + '";';
}

fs.writeFile("dist/endpoint.js", fileContent, function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

