var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../../config/db.js');
//Setting the router
var routerHome = express.Router();


//Connecting the database
mongoose.connect(dbConfig.url);

var Home = require('../models/home_model.js');

routerHome.use(( request,response,next) => {
	console.log(request.url);
	next();
});

routerHome.get('/', (request,response) => {
	Home.find(function(err,homes) {
		if(err)
			response.json({'error':err});
		response.json(homes);
	});
	//response.json({'body':'Successs', 'count':request.count});
});

routerHome.get('/:home_id', (request,response) => {
	Home.findById(request.params.home_id, (err, home) => {
		if(err)
			response.json({'error':err});
		response.json(home);
	});
});

routerHome.post('/', (request,response) => {
	var home = new Home();
	home.name = request.body.name;

	home.save(err=> {
		if(err)
			response.send(err);
		response.json({"message":`${home.name} created!`});
	});
});

routerHome.put('/:home_id',(request,response) => {
	Home.findById(request.params.home_id, (err,home) => {
		if(err) 
			response.json({'error': err});
		home.name = request.body.name;
		home.save(err=> {
			if(err)
				response.send(err);
			response.json({"message": `Home ${home.name} updated!`});
		});
	});
});
routerHome.delete('/:home_id', (request,response)=> {
	Home.findById(request.params.home_id, (err,home) => {
		if(err)
			response.json({'error':err});
		else {
			Home.remove({
				'_id': request.params.home_id
			}, (err,home)=> {
				if(err)
					response.json({"error":err});
				response.json({"message":"Successfully deleted the entity"});
			});
		}
	});
});
module.exports = routerHome;