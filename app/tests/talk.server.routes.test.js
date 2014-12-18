'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Talk = mongoose.model('Talk'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, talk;

/**
 * Talk routes tests
 */
describe('Talk CRUD tests', function() {
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

		// Save a user to the test db and create new Talk
		user.save(function() {
			talk = {
				name: 'Talk Name'
			};

			done();
		});
	});

	it('should be able to save Talk instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Talk
				agent.post('/talks')
					.send(talk)
					.expect(200)
					.end(function(talkSaveErr, talkSaveRes) {
						// Handle Talk save error
						if (talkSaveErr) done(talkSaveErr);

						// Get a list of Talks
						agent.get('/talks')
							.end(function(talksGetErr, talksGetRes) {
								// Handle Talk save error
								if (talksGetErr) done(talksGetErr);

								// Get Talks list
								var talks = talksGetRes.body;

								// Set assertions
								(talks[0].user._id).should.equal(userId);
								(talks[0].name).should.match('Talk Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Talk instance if not logged in', function(done) {
		agent.post('/talks')
			.send(talk)
			.expect(401)
			.end(function(talkSaveErr, talkSaveRes) {
				// Call the assertion callback
				done(talkSaveErr);
			});
	});

	it('should not be able to save Talk instance if no name is provided', function(done) {
		// Invalidate name field
		talk.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Talk
				agent.post('/talks')
					.send(talk)
					.expect(400)
					.end(function(talkSaveErr, talkSaveRes) {
						// Set message assertion
						(talkSaveRes.body.message).should.match('Please fill Talk name');
						
						// Handle Talk save error
						done(talkSaveErr);
					});
			});
	});

	it('should be able to update Talk instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Talk
				agent.post('/talks')
					.send(talk)
					.expect(200)
					.end(function(talkSaveErr, talkSaveRes) {
						// Handle Talk save error
						if (talkSaveErr) done(talkSaveErr);

						// Update Talk name
						talk.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Talk
						agent.put('/talks/' + talkSaveRes.body._id)
							.send(talk)
							.expect(200)
							.end(function(talkUpdateErr, talkUpdateRes) {
								// Handle Talk update error
								if (talkUpdateErr) done(talkUpdateErr);

								// Set assertions
								(talkUpdateRes.body._id).should.equal(talkSaveRes.body._id);
								(talkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Talks if not signed in', function(done) {
		// Create new Talk model instance
		var talkObj = new Talk(talk);

		// Save the Talk
		talkObj.save(function() {
			// Request Talks
			request(app).get('/talks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Talk if not signed in', function(done) {
		// Create new Talk model instance
		var talkObj = new Talk(talk);

		// Save the Talk
		talkObj.save(function() {
			request(app).get('/talks/' + talkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', talk.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Talk instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Talk
				agent.post('/talks')
					.send(talk)
					.expect(200)
					.end(function(talkSaveErr, talkSaveRes) {
						// Handle Talk save error
						if (talkSaveErr) done(talkSaveErr);

						// Delete existing Talk
						agent.delete('/talks/' + talkSaveRes.body._id)
							.send(talk)
							.expect(200)
							.end(function(talkDeleteErr, talkDeleteRes) {
								// Handle Talk error error
								if (talkDeleteErr) done(talkDeleteErr);

								// Set assertions
								(talkDeleteRes.body._id).should.equal(talkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Talk instance if not signed in', function(done) {
		// Set Talk user 
		talk.user = user;

		// Create new Talk model instance
		var talkObj = new Talk(talk);

		// Save the Talk
		talkObj.save(function() {
			// Try deleting Talk
			request(app).delete('/talks/' + talkObj._id)
			.expect(401)
			.end(function(talkDeleteErr, talkDeleteRes) {
				// Set message assertion
				(talkDeleteRes.body.message).should.match('User is not logged in');

				// Handle Talk error error
				done(talkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Talk.remove().exec();
		done();
	});
});