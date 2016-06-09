import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import { name as TaskAcknowledge } from '../taskAcknowledge';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { markAsAcknowledged } from '/imports/api/methods/taskMethods';

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

describe('TaskAcknowledge', function() {
  beforeEach(() => {
    angular.mock.module(TaskAcknowledge);
  });

  describe('controller', function() {
    let controller;

    beforeEach(() => {
      inject(
        function($rootScope, $componentController) {

          controller = $componentController(TaskAcknowledge, {
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

      it('should allow user to acknowledge a Task intended for him', function() {
        let task = {statusBy:'friendId', ack:false};

      //  spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isOffline').and.returnValue(false);  // mock
        spyOn(statusHelper, 'needAcknowledgement').and.returnValue(true);
        controller.task = task;
        let isShow = controller.show();

        expect(isShow).toBe(true);
      });



    });


    describe('action()', function() {

      it('should update task to acknowledged', function() {
       
        spyOn(markAsAcknowledged,'call');
        controller.task =  {_id:"taskId"};
        controller.action();
        expect(markAsAcknowledged.call.calls.mostRecent().args[0]).toEqual({
          taskId: controller.task._id
        });
      });


    });


  });
});
