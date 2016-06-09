import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as DueDateEdit } from '../dueDateEdit';
import { updateDueDate } from '/imports/api/methods/taskMethods';
import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();


describe('DueDateEdit', function() {

  // How to mock services factories https://www.sitepoint.com/mocking-dependencies-angularjs-tests/
  beforeEach(() => {
    angular.mock.module(DueDateEdit);
    angular.mock.module(function($provide) {
      $provide.value('version', 'overridden'); // override version here

      $provide.factory('dueDateEditService', function() {

        var service = {
            getTask : getTask
        }
        return service;

        function getTask() {
          console.log("hello");
          return { dueDate: new Date()};
        }
      });
    });
  });

  describe('controller', function() {
    let controller;



    beforeEach(() => {

      inject(
        function($rootScope, $componentController,_version_, _dueDateEditService_ ) {
//console.log("version=", _version_);
//console.log("dueDateEditService=",_dueDateEditService_.getTask());
          controller = $componentController(DueDateEdit, {
            $scope: $rootScope.$new(true),
            dueDateEditService : _dueDateEditService_
          }
          );
        }
      );

    });


    describe('getDueDate()', function() {

      it('should use default dueDate if dueDate not provided', function() {
        spyOn(controller, 'getDueDate').and.callThrough(); // mock


        let defaultDate = controller.getDefaultDueDate();
        myTask =  { dueDate: null};
        let expectedDate = controller.getDueDate(myTask);

        expect(expectedDate.getTime() ).toBe(defaultDate.getTime());
      });

      it('should use specified dueDate if provided', function() {
        spyOn(controller, 'getDueDate').and.callThrough(); // mock

        myTask =  { dueDate: new Date()};
        let expectedDate = controller.getDueDate(myTask);

        expect(expectedDate.getTime() ).toBe(myTask.dueDate.getTime());
      });
    });

    describe('action()', function() {

      it('should update dueDate for a Task', function() {
        spyOn(updateDueDate, 'call');
        spyOn(controller, 'closeModal');

        myTask =  { _id: "CSzCFbN3WaNNPhBwE", dueDate: null};

        controller.currTask = myTask;
        controller.dueDate = new Date();
        controller.action();

        expect(updateDueDate.call.calls.mostRecent().args[0]).toEqual({
          taskId: controller.currTask._id,
          dueDate : controller.dueDate
        });
      });

      it('should not update dueDate if null date', function() {
        spyOn(updateDueDate, 'call').and.callThrough();
        spyOn(controller, 'closeModal');
        spyOn(controller, 'handleError');

        myTask =  { _id: "CSzCFbN3WaNNPhBwE", dueDate: null};

        controller.currTask = myTask;
        controller.dueDate = '';

        controller.action();
        expect(controller.handleError).toHaveBeenCalled();

      });

    });




  });

});
