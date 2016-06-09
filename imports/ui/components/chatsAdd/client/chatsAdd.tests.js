import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as ChatsAdd } from '../chatsAdd';
import { name as uiService } from '/imports/ui/services/uiService';

import { share } from '/imports/api/methods/taskMethods';
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

describe('ChatsAdd', function() {
  beforeEach(() => {
    angular.mock.module(ChatsAdd);
    angular.mock.module(uiService);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController, _$reactive_, _$state_, _uiService_) {

          controller = $componentController(ChatsAdd, {
            $scope: $rootScope.$new(true),
            $reactive: _$reactive_,
            $state: _$state_,
            uiService: _uiService_
          }
          );
        }
      );

    });

    describe('newChat()', function() {

      it('should try to use CHAI assert, expect', function() {

        assert.equal(3, '3', '== coerces values to strings');
        assert.strictEqual(true, true, 'these booleans are strictly equal');

        function serveTea() { return 'cup of tea'; };
        assert.isFunction(serveTea, 'great, we can have tea now');

        let foo="hello";
        chaiExpect(foo).to.be.a('string');
        foo.should.have.length(5);
      });

      it('should share a promise with valid user', function() {

        spyOn(controller.uiService, 'hideModal'); // mock
        spyOn(share, 'call').and.returnValue(true);  // mock


        userId = 'KeaXDfpTMaX23c4tt';
        controller.taskId = "111";
        controller.newChat(userId);

        expect(share.call.calls.mostRecent().args[0]).toEqual({
          taskId: controller.taskId,
          otherUserId: userId
        });
      });


    });


  });
});
