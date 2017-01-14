var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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
var userRouter = require('./app/controllers/user.js');



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET, POST, DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
  next();
});


//All routers getting linked to the app
app.use('/a',authRouter);
app.use(jwtauth, function(request,response,next) {
	//response.write(JSON.stringify(request.user_data,null,2));
next();
})
app.use('/user',userRouter);
app.use('/home',homeRouter);


/*io.on('connection', function (socket) {
  socket.on('echo', function (data, response) {
  	console.log(data);
    response(data);
    setTimeout(function(){
    	socket.emit('auto',{'message':'Sent a message 4seconds after connection!'});
  		}, 4000);
  });

  socket.on('message', function (data, response) {
  	console.log(data);
});

});
  */
console.log("listening to port ${port}");
http.listen(port);
