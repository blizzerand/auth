var express = require('express');
var app = express();
var passport = require('passport');
var morgan = require('morgan');
var count=0;

//Body parsers
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//morgan for development
app.use(morgan('dev'));
var port = process.env.PORT || 8080;

//All routers are described here
var homeRouter = require('./home/home.js');
app.use(passport.initialize());



//All routers getting linked to the app
app.use((request,response,next) => {
 request.count = count;
 count=count +1;
next();
})

app.use('/home',homeRouter);


console.log("listening to port ${port}");
app.listen(port);
