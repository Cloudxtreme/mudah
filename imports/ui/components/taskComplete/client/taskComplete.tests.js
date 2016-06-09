import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as TaskComplete } from '../taskComplete';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { markAsCompleted } from '/imports/api/methods/taskMethods';

import 'angular-mocks';

import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

describe('TaskComplete', function() {
  beforeEach(() => {
    angular.mock.module(TaskComplete);
  });

  describe('controller', function() {
    let controller;

    beforeEach(() => {
      inject(
        function($rootScope, $componentController, _$reactive_) {
          controller = $componentController(TaskComplete, {
            $scope: $rootScope.$new(true),
            $reactive  : _$reactive_
          });
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

      it('should allow option to complete Task', function() {

        spyOn(statusHelper, 'isOffline').and.returnValue(false);  // mock
        spyOn(statusHelper, 'allow').and.returnValue(true);
        controller.task = {completed:false};
        let isShow = controller.show();

        expect(isShow).toBe(true);
      });

    });

    describe('action()', function() {

      it('should update Task to Completed', function() {

          spyOn(markAsCompleted, 'call').and.returnValue(true);        // mock

          controller.task = {_id: "4JYG4SMG4gs8HGMSi"};

          controller.action();
          expect(markAsCompleted.call.calls.mostRecent().args[0]).toEqual({
            taskId: controller.task._id
          });
      });
    });

  });
});
