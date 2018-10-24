var express = require('express');
var cors = require('cors');
const puppeteer = require('puppeteer');
var costco = require('./router/costco');
var costcov2 = require('./router/costcov2');
var herokuProxy = require('heroku-proxy');
var amazon = require('./router/rattingAmazon');
var amazonv2 = require('./router/Amazon');

var ebay = require('./router/ebay');

var app = express();
var server = require('http').createServer(app);
server.listen(process.env.PORT||3000 );

app.use(cors());
app.use(herokuProxy(

   
));
app.use('/node/express/myapp/GetDetail',costco);
app.use('/node/express/myapp/GetDetailImage',costcov2);
app.use('/node/express/myapp/GetDetailamzon',amazon);
app.use('/node/express/myapp/amazon',amazonv2);
app.use('/ebay/GetDetail',ebay);
app.get("/", function (req, res) {
   return res.send("tuan");
   
  });





