import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import { name as TaskChat } from '../taskChat';
import { statusHelper } from '/imports/ui/helpers/statusHelper';

import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

describe('TaskChat', function() {
  beforeEach(() => {
    angular.mock.module(TaskChat);
  });

  describe('controller', function() {
    let controller;

    beforeEach(() => {
      inject(
        function($rootScope, $componentController) {

          controller = $componentController(TaskChat, {
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

      it('should allow user to Chat if is a shared Task', function() {
        let task = {statusBy:'friendId', ack:false};

      //  spyOn(controller, 'show').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(statusHelper, 'isOffline').and.returnValue(false);  // mock
        spyOn(statusHelper, 'isSharedTask').and.returnValue(true);
        controller.task = {_id:"taskId"};
        let isShow = controller.show();

        expect(isShow).toBe(true);
      });



    });


  });
});
