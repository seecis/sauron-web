// Copyright 2018 Legrin, LLC
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.

let express = require('express');
let puppeteer = require('puppeteer');
let app = express();


function stripScripts(s) {
    return s;
    // var div = document.createElement('div');
    // div.innerHTML = s;
    // var scripts = div.getElementsByTagName('script');
    // var i = scripts.length;
    // while (i--) {
    //     scripts[i].parentNode.removeChild(scripts[i]);
    // }
    // return div.innerHTML;
}


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/proxy', function (req, res) {
    let url = req.query.url;
    (async () => {
        const browser = await puppeteer.launch({headless: false}); // default is true
        const page = await browser.newPage();
        await page.goto(url);
        let body = await page.content();
        res.send(stripScripts(body));
        await browser.close();
    })();
});

app.listen(9092, () => console.log('Example app listening on port 9092!'));