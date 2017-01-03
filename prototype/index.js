var express = require('express');
var app = express();
//var passport = require('passport');
var morgan = require('morgan');
var jwtauth = require('./app/lib/jwtlib.js');

//Body parsers
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//morgan for development
app.use(morgan('dev'));

var port = process.env.PORT || 8080;


//All routers are described here
var homeRouter = require('./app/controllers/home.js');
var authRouter = require('./app/controllers/authentication.js');




//All routers getting linked to the app
app.use('/a',authRouter);
app.use(jwtauth, function(request,response,next) {
	//response.write(JSON.stringify(request.user_data));
next();
})

app.use('/home',homeRouter);




console.log("listening to port ${port}");
app.listen(port);
