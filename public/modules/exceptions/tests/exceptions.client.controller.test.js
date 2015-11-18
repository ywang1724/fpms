'use strict';

(function() {
	// Exceptions Controller Spec
	describe('Exceptions Controller Tests', function() {
		// Initialize global variables
		var ExceptionsController,
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

			// Initialize the Exceptions controller.
			ExceptionsController = $controller('ExceptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Exception object fetched from XHR', inject(function(Exceptions) {
			// Create sample Exception using the Exceptions service
			var sampleException = new Exceptions({
				name: 'New Exception'
			});

			// Create a sample Exceptions array that includes the new Exception
			var sampleExceptions = [sampleException];

			// Set GET response
			$httpBackend.expectGET('exceptions').respond(sampleExceptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.exceptions).toEqualData(sampleExceptions);
		}));

		it('$scope.findOne() should create an array with one Exception object fetched from XHR using a exceptionId URL parameter', inject(function(Exceptions) {
			// Define a sample Exception object
			var sampleException = new Exceptions({
				name: 'New Exception'
			});

			// Set the URL parameter
			$stateParams.exceptionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/exceptions\/([0-9a-fA-F]{24})$/).respond(sampleException);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.exception).toEqualData(sampleException);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Exceptions) {
			// Create a sample Exception object
			var sampleExceptionPostData = new Exceptions({
				name: 'New Exception'
			});

			// Create a sample Exception response
			var sampleExceptionResponse = new Exceptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Exception'
			});

			// Fixture mock form input values
			scope.name = 'New Exception';

			// Set POST response
			$httpBackend.expectPOST('exceptions', sampleExceptionPostData).respond(sampleExceptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Exception was created
			expect($location.path()).toBe('/exceptions/' + sampleExceptionResponse._id);
		}));

		it('$scope.update() should update a valid Exception', inject(function(Exceptions) {
			// Define a sample Exception put data
			var sampleExceptionPutData = new Exceptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Exception'
			});

			// Mock Exception in scope
			scope.exception = sampleExceptionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/exceptions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/exceptions/' + sampleExceptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid exceptionId and remove the Exception from the scope', inject(function(Exceptions) {
			// Create new Exception object
			var sampleException = new Exceptions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Exceptions array and include the Exception
			scope.exceptions = [sampleException];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/exceptions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleException);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.exceptions.length).toBe(0);
		}));
	});
}());