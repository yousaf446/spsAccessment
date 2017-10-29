// expose app
exports = module.exports = app;

var express = require('express');

const bodyParser= require('body-parser');
var app = express();
var parser = require('./modules/parser');
var multer  = require('multer')
var upload = multer({ dest: 'server/uploads/' })

var port = 3000;
var version = 'v1';
var prefix = '/api/' + version + '/';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post(prefix + 'parseFile', upload.single('file'), parser.parseFile);

app.listen(port, function () {
    console.log('App listening on port 3000!');
});
