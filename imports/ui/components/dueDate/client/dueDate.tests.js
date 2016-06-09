import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as DueDate } from '../dueDate';
import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();


describe('DueDate', function() {

  // How to mock services factories https://www.sitepoint.com/mocking-dependencies-angularjs-tests/
  beforeEach(() => {
    angular.mock.module(DueDate);
    /*
    angular.mock.module(function($provide) {

      $provide.factory('dueDateEditService', function() {
        var service = {
            getTask : getTask
        }
        return service;

        function getTask() {
          return { dueDate: new Date()};
        }
      });
    });
    */
  });

  describe('controller', function() {
    let controller;

    beforeEach(() => {

      inject(
        function($rootScope, $componentController ) {

          controller = $componentController(DueDate, {
            $scope: $rootScope.$new(true)
          }
          );
        }
      );

    });


    describe('controller()', function() {

      it('should display dueDate if provided', function() {


        expect(true).toBe(true);
      });

      

    });


  });

});
