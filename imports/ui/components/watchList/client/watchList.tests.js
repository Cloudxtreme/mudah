import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import { name as WatchList } from '../watchList';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { statusHelper } from '/imports/ui/helpers/statusHelper';

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

describe('WatchList', function() {
  beforeEach(() => {
    //window.module(TaskEdit);
    angular.mock.module(WatchList);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController,_$reactive_) {

          controller = $componentController(WatchList, {
            $scope: $rootScope.$new(true),
            $reactive: _$reactive_
          }
          );
        }
      );
    });

    describe('create()', function() {

      it('should try to use CHAI assert, expect', function() {

        assert.equal(3, '3', '== coerces values to strings');
        assert.strictEqual(true, true, 'these booleans are strictly equal');

        function serveTea() { return 'cup of tea'; };
        assert.isFunction(serveTea, 'great, we can have tea now');

        let foo="hello";
        chaiExpect(foo).to.be.a('string');
        foo.should.have.length(5);
      });
    });

    describe('load()', function() {

      it('should subscribe to Tasks', function() {
        spyOn(controller, 'subscribe');
        controller.load();
        expect(controller.subscribe.calls.mostRecent().args[0]).toEqual('tasks');
      });

      it('should return list of watched Tasks for the user', function() {
        spyOn(taskHelper, 'getWatchList');
        spyOn(Meteor, 'userId').and.returnValue("KeaXDfpTMaX23c4tt");
        controller.load();
        expect(taskHelper.getWatchList).toHaveBeenCalledWith( Meteor.userId() );
      });
    });
});
});
