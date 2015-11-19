'use strict';

(function() {
	// Mails Controller Spec
	describe('Mails Controller Tests', function() {
		// Initialize global variables
		var MailsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Mails controller.
			MailsController = $controller('MailsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mail object fetched from XHR', inject(function(Mails) {
			// Create sample Mail using the Mails service
			var sampleMail = new Mails({
				name: 'New Mail'
			});

			// Create a sample Mails array that includes the new Mail
			var sampleMails = [sampleMail];

			// Set GET response
			$httpBackend.expectGET('mails').respond(sampleMails);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mails).toEqualData(sampleMails);
		}));

		it('$scope.findOne() should create an array with one Mail object fetched from XHR using a mailId URL parameter', inject(function(Mails) {
			// Define a sample Mail object
			var sampleMail = new Mails({
				name: 'New Mail'
			});

			// Set the URL parameter
			$stateParams.mailId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mails\/([0-9a-fA-F]{24})$/).respond(sampleMail);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mail).toEqualData(sampleMail);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mails) {
			// Create a sample Mail object
			var sampleMailPostData = new Mails({
				name: 'New Mail'
			});

			// Create a sample Mail response
			var sampleMailResponse = new Mails({
				_id: '525cf20451979dea2c000001',
				name: 'New Mail'
			});

			// Fixture mock form input values
			scope.name = 'New Mail';

			// Set POST response
			$httpBackend.expectPOST('mails', sampleMailPostData).respond(sampleMailResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mail was created
			expect($location.path()).toBe('/mails/' + sampleMailResponse._id);
		}));

		it('$scope.update() should update a valid Mail', inject(function(Mails) {
			// Define a sample Mail put data
			var sampleMailPutData = new Mails({
				_id: '525cf20451979dea2c000001',
				name: 'New Mail'
			});

			// Mock Mail in scope
			scope.mail = sampleMailPutData;

			// Set PUT response
			$httpBackend.expectPUT(/mails\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mails/' + sampleMailPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mailId and remove the Mail from the scope', inject(function(Mails) {
			// Create new Mail object
			var sampleMail = new Mails({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mails array and include the Mail
			scope.mails = [sampleMail];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mails\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMail);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mails.length).toBe(0);
		}));
	});
}());