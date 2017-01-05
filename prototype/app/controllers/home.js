var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../../config/db.js');
//Setting the router
var routerHome = express.Router();


//Connecting the database
mongoose.connect(dbConfig.url);

var Home = require('../models/home_model.js');
var User  = require('../models/user_model.js');

routerHome.use(( request,response,next) => {
	console.log(request.url);
	next();
});

routerHome.get('/', (request,response) => {
	Home.find({"administrator":request.user_data.data.id}, function(err,homes) {
		if(err)
			response.json({'error':err});
		else{

	//response.json({homes});
	response.write(JSON.stringify({homes},null,2)),
	response.end();
	}
	});
	//response.json({'body':'Successs', 'count':request.count});
});

routerHome.get('/:home_id', (request,response) => {

	Home.findOne({ $and:
		[{"administrator": request.user_data.data.id},{"_id":request.params.home_id}]}, (err, home) => {
		if(err)
			response.json({'error':err});
		else{
			if(home) {
				console.log(request.params.home_id);
			response.write(JSON.stringify({home},null,2));
			response.end();
			}
			else {				
				response.write(JSON.stringify({type: false, message: "This page doesn't exist or you don't have rights to view this object"},null,2));
				response.end();
			}
		}
	});
});

routerHome.post('/', (request,response) => {
	var home = new Home();
	home.name = request.body.name;
	home.administrator  = request.user_data.data.id;


	home.save(err=> {
		if(err)
			response.send(err);
		else{
			response.write(JSON.stringify({"message":`${home.name} created!`},null,2));
			response.end();
		}
	});
});

routerHome.put('/:home_id',(request,response) => {
	Home.findOne({ $and:
		[{"administrator": request.user_data.data.id},{"_id":request.params.home_id}]}, (err, home) => {
		if(err) 
			response.json({'error': err});
		else if(home) {
			home.name = request.body.name;
			home.save(err=> {
				if(err)
					response.send(err);
				else{
					response.write(JSON.stringify({"message": `Home ${home.name} updated!`},null,2));
					response.end();
				}
			});
		}
		else {				
				response.write(JSON.stringify({type: false, message: "This page doesn't exist or you don't have rights to view this object"},null,2));
				response.end();
			}
	});	
});
routerHome.delete('/:home_id', (request,response)=> {
	Home.findOne({ $and:
		[{"administrator": request.user_data.data.id},{"_id":request.params.home_id}]}, (err, home) => {
		if(err)
			response.json({'error':err});
		else if(home){
			Home.remove({'_id': request.params.home_id}, (err,home)=> {
				if(err)
					response.json({"error":err});
				else{
					response.write(JSON.stringify({"message":"Successfully deleted the entity"},null,2));
					response.end();
				}
			});
		}
		else {				
				response.write(JSON.stringify({type: false, message: "This page doesn't exist or you don't have rights to view this object"},null,2));
				response.end();
			}
	});
});
module.exports = routerHome;