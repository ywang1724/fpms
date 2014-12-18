'use strict';

(function() {
	// Timings Controller Spec
	describe('Timings Controller Tests', function() {
		// Initialize global variables
		var TimingsController,
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

			// Initialize the Timings controller.
			TimingsController = $controller('TimingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Timing object fetched from XHR', inject(function(Timings) {
			// Create sample Timing using the Timings service
			var sampleTiming = new Timings({
				name: 'New Timing'
			});

			// Create a sample Timings array that includes the new Timing
			var sampleTimings = [sampleTiming];

			// Set GET response
			$httpBackend.expectGET('timings').respond(sampleTimings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timings).toEqualData(sampleTimings);
		}));

		it('$scope.findOne() should create an array with one Timing object fetched from XHR using a timingId URL parameter', inject(function(Timings) {
			// Define a sample Timing object
			var sampleTiming = new Timings({
				name: 'New Timing'
			});

			// Set the URL parameter
			$stateParams.timingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/timings\/([0-9a-fA-F]{24})$/).respond(sampleTiming);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timing).toEqualData(sampleTiming);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Timings) {
			// Create a sample Timing object
			var sampleTimingPostData = new Timings({
				name: 'New Timing'
			});

			// Create a sample Timing response
			var sampleTimingResponse = new Timings({
				_id: '525cf20451979dea2c000001',
				name: 'New Timing'
			});

			// Fixture mock form input values
			scope.name = 'New Timing';

			// Set POST response
			$httpBackend.expectPOST('timings', sampleTimingPostData).respond(sampleTimingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Timing was created
			expect($location.path()).toBe('/timings/' + sampleTimingResponse._id);
		}));

		it('$scope.update() should update a valid Timing', inject(function(Timings) {
			// Define a sample Timing put data
			var sampleTimingPutData = new Timings({
				_id: '525cf20451979dea2c000001',
				name: 'New Timing'
			});

			// Mock Timing in scope
			scope.timing = sampleTimingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/timings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/timings/' + sampleTimingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid timingId and remove the Timing from the scope', inject(function(Timings) {
			// Create new Timing object
			var sampleTiming = new Timings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Timings array and include the Timing
			scope.timings = [sampleTiming];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/timings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTiming);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.timings.length).toBe(0);
		}));
	});
}());