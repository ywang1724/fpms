'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mail = mongoose.model('Mail'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mail;

/**
 * Mail routes tests
 */
describe('Mail CRUD tests', function() {
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

		// Save a user to the test db and create new Mail
		user.save(function() {
			mail = {
				name: 'Mail Name'
			};

			done();
		});
	});

	it('should be able to save Mail instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mail
				agent.post('/mails')
					.send(mail)
					.expect(200)
					.end(function(mailSaveErr, mailSaveRes) {
						// Handle Mail save error
						if (mailSaveErr) done(mailSaveErr);

						// Get a list of Mails
						agent.get('/mails')
							.end(function(mailsGetErr, mailsGetRes) {
								// Handle Mail save error
								if (mailsGetErr) done(mailsGetErr);

								// Get Mails list
								var mails = mailsGetRes.body;

								// Set assertions
								(mails[0].user._id).should.equal(userId);
								(mails[0].name).should.match('Mail Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mail instance if not logged in', function(done) {
		agent.post('/mails')
			.send(mail)
			.expect(401)
			.end(function(mailSaveErr, mailSaveRes) {
				// Call the assertion callback
				done(mailSaveErr);
			});
	});

	it('should not be able to save Mail instance if no name is provided', function(done) {
		// Invalidate name field
		mail.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mail
				agent.post('/mails')
					.send(mail)
					.expect(400)
					.end(function(mailSaveErr, mailSaveRes) {
						// Set message assertion
						(mailSaveRes.body.message).should.match('Please fill Mail name');
						
						// Handle Mail save error
						done(mailSaveErr);
					});
			});
	});

	it('should be able to update Mail instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mail
				agent.post('/mails')
					.send(mail)
					.expect(200)
					.end(function(mailSaveErr, mailSaveRes) {
						// Handle Mail save error
						if (mailSaveErr) done(mailSaveErr);

						// Update Mail name
						mail.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mail
						agent.put('/mails/' + mailSaveRes.body._id)
							.send(mail)
							.expect(200)
							.end(function(mailUpdateErr, mailUpdateRes) {
								// Handle Mail update error
								if (mailUpdateErr) done(mailUpdateErr);

								// Set assertions
								(mailUpdateRes.body._id).should.equal(mailSaveRes.body._id);
								(mailUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mails if not signed in', function(done) {
		// Create new Mail model instance
		var mailObj = new Mail(mail);

		// Save the Mail
		mailObj.save(function() {
			// Request Mails
			request(app).get('/mails')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mail if not signed in', function(done) {
		// Create new Mail model instance
		var mailObj = new Mail(mail);

		// Save the Mail
		mailObj.save(function() {
			request(app).get('/mails/' + mailObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mail.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mail instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mail
				agent.post('/mails')
					.send(mail)
					.expect(200)
					.end(function(mailSaveErr, mailSaveRes) {
						// Handle Mail save error
						if (mailSaveErr) done(mailSaveErr);

						// Delete existing Mail
						agent.delete('/mails/' + mailSaveRes.body._id)
							.send(mail)
							.expect(200)
							.end(function(mailDeleteErr, mailDeleteRes) {
								// Handle Mail error error
								if (mailDeleteErr) done(mailDeleteErr);

								// Set assertions
								(mailDeleteRes.body._id).should.equal(mailSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mail instance if not signed in', function(done) {
		// Set Mail user 
		mail.user = user;

		// Create new Mail model instance
		var mailObj = new Mail(mail);

		// Save the Mail
		mailObj.save(function() {
			// Try deleting Mail
			request(app).delete('/mails/' + mailObj._id)
			.expect(401)
			.end(function(mailDeleteErr, mailDeleteRes) {
				// Set message assertion
				(mailDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mail error error
				done(mailDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mail.remove().exec();
		done();
	});
});