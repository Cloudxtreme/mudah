import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import { name as TaskAccept } from '../taskAccept';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { updateStatus } from '/imports/api/methods/taskMethods';

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

describe('TaskAccept', function() {
  beforeEach(() => {
    angular.mock.module(TaskAccept);
  });

  describe('controller', function() {

    const newTask = {
      _id: '4JYG4SMG4gs8HGMSi',
      name: 'Foo-changed-this-value',
      reward: '1000-changed',
      forfeit: '200',
      dueDate: '01/01/2001'
    };

    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController) {

          controller = $componentController(TaskAccept, {
            $scope: $rootScope.$new(true)
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


      it('should NOT show option if Device is offline ',function() {

        spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isOffline').and.returnValue(true);  // mock

        let isShow = controller.show();

        expect(statusHelper.isOffline).toHaveBeenCalled();
        expect(isShow).toBe(false);
      });

      it('should allow user to accept own Task', function() {
        let task = { status: statusHelper.status.DRAFT};

        spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isOffline').and.returnValue(false);  // mock
        spyOn(statusHelper, 'isPrivateTask').and.returnValue(true);
        controller.task = task;
        let isShow = controller.show();

        expect(isShow).toBe(true);
      });

      it('should allow user to accept a Task if and user is a participant', function() {
        let task = { status: statusHelper.status.PENDING};

        spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isPrivateTask').and.returnValue(false);
        spyOn(statusHelper, 'isOffline').and.returnValue(false);  // mock
        spyOn(controller, 'isMyTurnToRespond').and.returnValue(true);

        controller.task = task;
        let isShow = controller.show();

        expect(isShow).toBe(true);
      });

      it('should allow User to accept if  user was not the last person to edit the task', function() {
        let task = { status: statusHelper.status.PENDING, edited:true, editedBy: 'otherUser'};

        spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isPrivateTask').and.returnValue(false);
        spyOn(statusHelper, 'isOffline').and.returnValue(false);  // mock
        spyOn(statusHelper, 'isParticipant').and.returnValue(true);

        controller.task = task;
        let isShow = controller.show();

        expect(isShow).toBe(true);
      });

    });


    describe('action()', function() {

      it('should update task to change status', function() {

        spyOn(controller, 'action').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(updateStatus, 'call').and.returnValue(true);        // mock
        spyOn(statusHelper, 'getNextStatus').and.callThrough();

        controller.task = {_id: "4JYG4SMG4gs8HGMSi", status: statusHelper.status.DRAFT};

        newStat = statusHelper.getNextStatus('taskAccept', controller.task.status);

        controller.action();
        expect(updateStatus.call.calls.mostRecent().args[0]).toEqual({
          taskId: controller.task._id,
          newStatus : newStat
        });
      });


    });


  });
});
