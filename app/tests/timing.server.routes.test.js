'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Timing = mongoose.model('Timing'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, timing;

/**
 * Timing routes tests
 */
describe('Timing CRUD tests', function() {
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

		// Save a user to the test db and create new Timing
		user.save(function() {
			timing = {
				name: 'Timing Name'
			};

			done();
		});
	});

	it('should be able to save Timing instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timing
				agent.post('/timings')
					.send(timing)
					.expect(200)
					.end(function(timingSaveErr, timingSaveRes) {
						// Handle Timing save error
						if (timingSaveErr) done(timingSaveErr);

						// Get a list of Timings
						agent.get('/timings')
							.end(function(timingsGetErr, timingsGetRes) {
								// Handle Timing save error
								if (timingsGetErr) done(timingsGetErr);

								// Get Timings list
								var timings = timingsGetRes.body;

								// Set assertions
								(timings[0].user._id).should.equal(userId);
								(timings[0].name).should.match('Timing Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Timing instance if not logged in', function(done) {
		agent.post('/timings')
			.send(timing)
			.expect(401)
			.end(function(timingSaveErr, timingSaveRes) {
				// Call the assertion callback
				done(timingSaveErr);
			});
	});

	it('should not be able to save Timing instance if no name is provided', function(done) {
		// Invalidate name field
		timing.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timing
				agent.post('/timings')
					.send(timing)
					.expect(400)
					.end(function(timingSaveErr, timingSaveRes) {
						// Set message assertion
						(timingSaveRes.body.message).should.match('Please fill Timing name');
						
						// Handle Timing save error
						done(timingSaveErr);
					});
			});
	});

	it('should be able to update Timing instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timing
				agent.post('/timings')
					.send(timing)
					.expect(200)
					.end(function(timingSaveErr, timingSaveRes) {
						// Handle Timing save error
						if (timingSaveErr) done(timingSaveErr);

						// Update Timing name
						timing.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Timing
						agent.put('/timings/' + timingSaveRes.body._id)
							.send(timing)
							.expect(200)
							.end(function(timingUpdateErr, timingUpdateRes) {
								// Handle Timing update error
								if (timingUpdateErr) done(timingUpdateErr);

								// Set assertions
								(timingUpdateRes.body._id).should.equal(timingSaveRes.body._id);
								(timingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Timings if not signed in', function(done) {
		// Create new Timing model instance
		var timingObj = new Timing(timing);

		// Save the Timing
		timingObj.save(function() {
			// Request Timings
			request(app).get('/timings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Timing if not signed in', function(done) {
		// Create new Timing model instance
		var timingObj = new Timing(timing);

		// Save the Timing
		timingObj.save(function() {
			request(app).get('/timings/' + timingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', timing.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Timing instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timing
				agent.post('/timings')
					.send(timing)
					.expect(200)
					.end(function(timingSaveErr, timingSaveRes) {
						// Handle Timing save error
						if (timingSaveErr) done(timingSaveErr);

						// Delete existing Timing
						agent.delete('/timings/' + timingSaveRes.body._id)
							.send(timing)
							.expect(200)
							.end(function(timingDeleteErr, timingDeleteRes) {
								// Handle Timing error error
								if (timingDeleteErr) done(timingDeleteErr);

								// Set assertions
								(timingDeleteRes.body._id).should.equal(timingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Timing instance if not signed in', function(done) {
		// Set Timing user 
		timing.user = user;

		// Create new Timing model instance
		var timingObj = new Timing(timing);

		// Save the Timing
		timingObj.save(function() {
			// Try deleting Timing
			request(app).delete('/timings/' + timingObj._id)
			.expect(401)
			.end(function(timingDeleteErr, timingDeleteRes) {
				// Set message assertion
				(timingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Timing error error
				done(timingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Timing.remove().exec();
		done();
	});
});