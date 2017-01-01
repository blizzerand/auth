var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../../config/db.js');

module.exports = function(app, passport) {

	app.get('/login', (request,response) => {
		response.json({"serverStatus" :1111});
	});

	app.get('/signup', (request,response)=> {
		response.json({"serverStatus":1111});
	});

	  app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        
    }));

};

