'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Exception = mongoose.model('Exception'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, exception;

/**
 * Exception routes tests
 */
describe('Exception CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Exception
		user.save(function() {
			exception = {
				name: 'Exception Name'
			};

			done();
		});
	});

	it('should be able to save Exception instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exception
				agent.post('/exceptions')
					.send(exception)
					.expect(200)
					.end(function(exceptionSaveErr, exceptionSaveRes) {
						// Handle Exception save error
						if (exceptionSaveErr) done(exceptionSaveErr);

						// Get a list of Exceptions
						agent.get('/exceptions')
							.end(function(exceptionsGetErr, exceptionsGetRes) {
								// Handle Exception save error
								if (exceptionsGetErr) done(exceptionsGetErr);

								// Get Exceptions list
								var exceptions = exceptionsGetRes.body;

								// Set assertions
								(exceptions[0].user._id).should.equal(userId);
								(exceptions[0].name).should.match('Exception Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Exception instance if not logged in', function(done) {
		agent.post('/exceptions')
			.send(exception)
			.expect(401)
			.end(function(exceptionSaveErr, exceptionSaveRes) {
				// Call the assertion callback
				done(exceptionSaveErr);
			});
	});

	it('should not be able to save Exception instance if no name is provided', function(done) {
		// Invalidate name field
		exception.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exception
				agent.post('/exceptions')
					.send(exception)
					.expect(400)
					.end(function(exceptionSaveErr, exceptionSaveRes) {
						// Set message assertion
						(exceptionSaveRes.body.message).should.match('Please fill Exception name');
						
						// Handle Exception save error
						done(exceptionSaveErr);
					});
			});
	});

	it('should be able to update Exception instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exception
				agent.post('/exceptions')
					.send(exception)
					.expect(200)
					.end(function(exceptionSaveErr, exceptionSaveRes) {
						// Handle Exception save error
						if (exceptionSaveErr) done(exceptionSaveErr);

						// Update Exception name
						exception.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Exception
						agent.put('/exceptions/' + exceptionSaveRes.body._id)
							.send(exception)
							.expect(200)
							.end(function(exceptionUpdateErr, exceptionUpdateRes) {
								// Handle Exception update error
								if (exceptionUpdateErr) done(exceptionUpdateErr);

								// Set assertions
								(exceptionUpdateRes.body._id).should.equal(exceptionSaveRes.body._id);
								(exceptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Exceptions if not signed in', function(done) {
		// Create new Exception model instance
		var exceptionObj = new Exception(exception);

		// Save the Exception
		exceptionObj.save(function() {
			// Request Exceptions
			request(app).get('/exceptions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Exception if not signed in', function(done) {
		// Create new Exception model instance
		var exceptionObj = new Exception(exception);

		// Save the Exception
		exceptionObj.save(function() {
			request(app).get('/exceptions/' + exceptionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', exception.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Exception instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exception
				agent.post('/exceptions')
					.send(exception)
					.expect(200)
					.end(function(exceptionSaveErr, exceptionSaveRes) {
						// Handle Exception save error
						if (exceptionSaveErr) done(exceptionSaveErr);

						// Delete existing Exception
						agent.delete('/exceptions/' + exceptionSaveRes.body._id)
							.send(exception)
							.expect(200)
							.end(function(exceptionDeleteErr, exceptionDeleteRes) {
								// Handle Exception error error
								if (exceptionDeleteErr) done(exceptionDeleteErr);

								// Set assertions
								(exceptionDeleteRes.body._id).should.equal(exceptionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Exception instance if not signed in', function(done) {
		// Set Exception user 
		exception.user = user;

		// Create new Exception model instance
		var exceptionObj = new Exception(exception);

		// Save the Exception
		exceptionObj.save(function() {
			// Try deleting Exception
			request(app).delete('/exceptions/' + exceptionObj._id)
			.expect(401)
			.end(function(exceptionDeleteErr, exceptionDeleteRes) {
				// Set message assertion
				(exceptionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Exception error error
				done(exceptionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Exception.remove().exec();
		done();
	});
});