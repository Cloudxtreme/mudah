import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import { name as TaskEdit } from '../taskEdit';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { updateTask } from '/imports/api/methods/taskMethods';
import { name as uiService } from '/imports/ui/services/uiService';

import 'angular-mocks';


//http://stackoverflow.com/questions/35173907/jasmine-spyon-on-function-and-returned-object

// Chai assertion library see: http://chaijs.com/guide/styles/
/*
var assert = require('chai').assert;
var chaiExpect = require('chai').expect;
var should = require('chai').should();
*/
import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

describe('TaskEdit', function() {
  beforeEach(() => {
    //window.module(TaskEdit);
    angular.mock.module(TaskEdit);
    angular.mock.module(uiService);
  });

  describe('controller', function() {


    const newTask = {
      _id: '4JYG4SMG4gs8HGMSi',
      name: 'Foo-changed-this-value',
      reward: '1000-changed',
      forfeit: '200',
      dueDate: '01/01/2001'
    };

    const oldTask = {
      _id: '4JYG4SMG4gs8HGMSi',
      name: 'Foo',
      reward: '100',
      forfeit: '200',
      dueDate: '01/01/2001'
    };
    let controller;
    let uiService;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

             testUiService = {
                 comingSoon: function () {
                    console.log("hello world");
                 }
             };


      inject(
        function($rootScope, $componentController, _$stateParams_,_$reactive_, _uiService_) {

          controller = $componentController(TaskEdit, {
            $scope: $rootScope.$new(true),
            $stateParams: _$stateParams_,
            $reactive: _$reactive_,
          //  uiService : testUiService
            uiService  : _uiService_
          }
          );
        }
      );
    });



    describe('show()', function() {

      it('should try to use CHAI assert, expect', function() {

        assert.equal(3, '3', '== coerces values to strings');
        assert.strictEqual(true, true, 'these booleans are strictly equal');

        function serveTea() { return 'cup of tea'; };
        assert.isFunction(serveTea, 'great, we can have tea now');

        let foo="hello";
        chaiExpect(foo).to.be.a('string');
        foo.should.have.length(5);
      });

      it('should show option if Device is online ', function() {

        spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isOffline').and.returnValue(false);  // mock

        let isShow = controller.show();

        expect(statusHelper.isOffline).toHaveBeenCalled();
        expect(isShow).toBe(true);
      });

      it('should NOT show option if Device is offline ',function() {

        spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isOffline').and.returnValue(true);  // mock

        let isShow = controller.show();

        expect(statusHelper.isOffline).toHaveBeenCalled();
        expect(isShow).toBe(false);
      });

    });


    describe('action()', function() {

      it('should update task if changes made', function() {

        spyOn(controller, 'action').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(taskHelper, 'getMyTask').and.returnValue(oldTask);  // mock
        spyOn(updateTask, 'call').and.returnValue(true);        // mock
        spyOn(controller.uiService, 'log').and.callThrough();

        controller.task = newTask;
        controller.action();

        expect(controller.action).toHaveBeenCalled();
        expect(controller.uiService.log).toHaveBeenCalled();
        expect(taskHelper.getMyTask).toHaveBeenCalledWith(newTask._id);
        expect(updateTask.call).toHaveBeenCalled();
        expect(updateTask.call.calls.mostRecent().args[0]).toEqual({
          task:newTask
        });
      });

      it('should NOT update Task if before/after values are same. no change', function() {

        spyOn(controller, 'action').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(taskHelper, 'getMyTask').and.returnValue(oldTask);  // mock
        spyOn(updateTask, 'call');        // mock
        spyOn(controller.uiService, 'log').and.callThrough();

        controller.task = oldTask;
        controller.action();

        expect(controller.action).toHaveBeenCalled();
        expect(controller.uiService.log).toHaveBeenCalled();
        expect(taskHelper.getMyTask).toHaveBeenCalledWith(oldTask._id);
        expect(updateTask.call).not.toHaveBeenCalled();
      });
    });
  });
});
