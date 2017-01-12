var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../../config/db.js');
//Setting the router
var routerRoom = express.Router();
var validator = require('validator');
var ObjectId = require('mongoose').Types.ObjectId;

var Home = require('../models/home_model.js');

routerRoom.use(( request,response,next) => {
	console.log("Helo");
	next();
});


routerRoom.post('/', (request,response) => {
	home = request.home;
	
	if(home) {
		var	room_name = request.body.room_name;
		var	room_alt_name = request.body.room_alt_name;
		console.log(home);
		home.rooms.push({ 'name':room_name, 'alt_name': room_alt_name});


		home.save( err=> {
			if(err) {
				response.write(JSON.stringify({error:err},null,2));
				response.end();
			}
			else {
				
				response.write(JSON.stringify({code:"CREATE-SUCCESS", message:"Room has been added"},null,2));
				response.end();
			
			}
		});
		
		/*home.rooms.save(err=> {
			if(err) {
				response.write(JSON.stringify({type: false, error: err},null,2));
				response.end();
				}
			else{

			console.log(room_name);
			}
		});*/
	}	
})

routerRoom.get('/', (request,response) => {
	home = request.home;
	if(home) {
		rooms = home.rooms;

		response.write(JSON.stringify({code:'GET-SUCCESS','rooms':rooms},null,2));
		response.end();
	}
})

routerRoom.delete('/:room_id',(request,response) => {
	home= request.home;
	room_id= new ObjectId(request.params.room_id);
	home_id = request.home_id;
	console.log(home_id);
		if(home && request.user === "Admin") {
		Home.update({_id: home_id }, { $pull: {rooms: {'_id':room_id}}}, (err,home) => {
			if(err) {
				response.write(JSON.stringify({code: 'Fail', error:err}));
				response.send();
			}
			else {
				response.write(JSON.stringify({code: 'DELETE-SUCCESS',home}));
				response.send();
			}
		})
	}

})



routerRoom.get('/:room_id', (request,response) => {
	home = request.home;
	if(home) {
		room_id = request.params.room_id;
		home_id = request.home_id;
		Home.findOne({_id:home_id},
			{rooms:
			 {$elemMatch : { _id: room_id} }
			}, (error,room) => {
			if(error) {
				response.write(JSON.stringify({type:false, 'error' :error},null,2));
				response.end();
			}
			else if(!room) {
				response.write(JSON.stringify({type: false, message: "This page doesn't exist or you don't have rights to view this object"},null,2));
				response.end();
			} 
			else {
				response.write(JSON.stringify({type:true, 'code':'GET_SUCCESS',room},null,2));
				response.end();

			}
		})
	}
	else {
		response.write(JSON.stringify({type:false, "message" : "Something went wrong, you don't have rights to view this home"},null,2));
		response.end();
	}

	
})


routerRoom.post('/:room_id/appliance', (request,response) => {
	home = request.home;
	if(home) {
		room_id = request.params.room_id;
		var	appliance_name = request.body.appliance_name;
		var appliance_type = request.body.appliance_type;
		var appliance_description = request.body.appliance_description;
		console.log(appliance_description);
		if(isEmpty(appliance_name) ||isEmpty(appliance_type)) {
			response.write(JSON.stringify({type:false, "message" : "You've left some fields empty"},null,2));
			response.end();
		}
		else {
			var toInsert = {'appliance_name':appliance_name, 'appliance_type':appliance_type,'appliance_description':appliance_description};
			Home.update({_id:request.home_id, "rooms._id" :room_id},
				{ $push: {
					"rooms.$.appliance": toInsert
					}
				}, (error,status) => {
					if(error) {
						response.write(JSON.stringify({type:false, 'error' :error},null,2));
						response.end();
					}
					else{
						response.write(JSON.stringify({"code":'ADD-SUCCESS',"message": `Appliance successfully added!`},null,2));
						response.end();
					}
				})
		}
	}
	
	else {
		response.write(JSON.stringify({type:false, "message" : "Something went wrong, you don't have rights to view this home"},null,2));
		response.end();
	}
})

routerRoom.get('/:room_id/appliance/:appliance_id', (request,response) => {
	home = request.home;
	if(home) {
		room_id = request.params.room_id;
		appliance_id = request.params.appliance_id;
		home_id = request.home_id;
		Home.findOne({rooms:
			 { elemMatch: 
			 	{ 'appliance._id': appliance_id }}}, {'rooms.$':home_id},  (error,appliance) => {
			if(error) {
				response.write(JSON.stringify({type:false, 'error' :error},null,2));
				response.end();
			}
			else if(!appliance) {

				response.write(JSON.stringify({type: false, message: "This page doesn't exist or you don't have rights to view this object"},null,2));
				response.end();
			} 
			else {
				response.write(JSON.stringify({type:true, 'code':'GET_SUCCESS',appliance},null,2));
				response.end();

			}
		})
	}
	else {
		response.write(JSON.stringify({type:false, "message" : "Something went wrong, you don't have rights to view this home"},null,2));
		response.end();
	}

	
})

function isEmpty(str) {
    return (!str || 0 === str.length);
}

 module.exports = routerRoom;
