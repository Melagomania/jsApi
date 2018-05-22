'use strict';
var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var appPort = 3001;

app.use(express.static(__dirname + '/public', {
    etag: false,
    lastModified: false
}));

app.get('*', function (req, res) {
    fs.createReadStream('./public/index.html').pipe(res);
});
app.listen(appPort, function () {
    console.log('Site available on http://localhost:' + appPort);
});