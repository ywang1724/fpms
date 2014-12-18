'use strict';

(function() {
	// Talks Controller Spec
	describe('Talks Controller Tests', function() {
		// Initialize global variables
		var TalksController,
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

			// Initialize the Talks controller.
			TalksController = $controller('TalksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Talk object fetched from XHR', inject(function(Talks) {
			// Create sample Talk using the Talks service
			var sampleTalk = new Talks({
				name: 'New Talk'
			});

			// Create a sample Talks array that includes the new Talk
			var sampleTalks = [sampleTalk];

			// Set GET response
			$httpBackend.expectGET('talks').respond(sampleTalks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.talks).toEqualData(sampleTalks);
		}));

		it('$scope.findOne() should create an array with one Talk object fetched from XHR using a talkId URL parameter', inject(function(Talks) {
			// Define a sample Talk object
			var sampleTalk = new Talks({
				name: 'New Talk'
			});

			// Set the URL parameter
			$stateParams.talkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/talks\/([0-9a-fA-F]{24})$/).respond(sampleTalk);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.talk).toEqualData(sampleTalk);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Talks) {
			// Create a sample Talk object
			var sampleTalkPostData = new Talks({
				name: 'New Talk'
			});

			// Create a sample Talk response
			var sampleTalkResponse = new Talks({
				_id: '525cf20451979dea2c000001',
				name: 'New Talk'
			});

			// Fixture mock form input values
			scope.name = 'New Talk';

			// Set POST response
			$httpBackend.expectPOST('talks', sampleTalkPostData).respond(sampleTalkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Talk was created
			expect($location.path()).toBe('/talks/' + sampleTalkResponse._id);
		}));

		it('$scope.update() should update a valid Talk', inject(function(Talks) {
			// Define a sample Talk put data
			var sampleTalkPutData = new Talks({
				_id: '525cf20451979dea2c000001',
				name: 'New Talk'
			});

			// Mock Talk in scope
			scope.talk = sampleTalkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/talks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/talks/' + sampleTalkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid talkId and remove the Talk from the scope', inject(function(Talks) {
			// Create new Talk object
			var sampleTalk = new Talks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Talks array and include the Talk
			scope.talks = [sampleTalk];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/talks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTalk);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.talks.length).toBe(0);
		}));
	});
}());