import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as Chat } from '../chat';

//import { name as Auth } from '../../auth/auth';

import { newMessage } from '/imports/api/methods/taskMethods';
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

describe('Chat', function() {
  beforeEach(() => {
    //window.module(TaskEdit);
    angular.mock.module(Chat);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {
console.log("before inject");

      inject(
        function($rootScope, $componentController, _$reactive_, _$state_, _$stateParams_,
                  _$log_, _$timeout_, _$ionicScrollDelegate_) {

          controller = $componentController(Chat, {
            $scope: $rootScope.$new(true),
            $reactive: _$reactive_,
            $state: _$state_,
            $stateParams: _$stateParams_,
            $log: _$log_,
            $timeout: _$timeout_,
            $ionicScrollDelegate : _$ionicScrollDelegate_
          }
          );
        }
      );

console.log("after inject");
    });

    describe('sendMessage()', function() {

      it('should try to use CHAI assert, expect', function() {

        assert.equal(3, '3', '== coerces values to strings');
        assert.strictEqual(true, true, 'these booleans are strictly equal');

        function serveTea() { return 'cup of tea'; };
        assert.isFunction(serveTea, 'great, we can have tea now');

        let foo="hello";
        chaiExpect(foo).to.be.a('string');
        foo.should.have.length(5);
      });

      it('should send a message if text not empty', function() {

        spyOn(controller, 'sendMessage').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(newMessage, 'call').and.returnValue(true);  // mock
        spyOn(controller, 'init');

        controller.message="this is a new message";
        controller.chatId="4JYG4SMG4gs8HGMSi";
        controller.sendMessage();

        expect(controller.sendMessage).toHaveBeenCalled();
        expect(newMessage.call).toHaveBeenCalled();
        expect(controller.init).toHaveBeenCalled();
      });

      it('should send a message to the relevant Chat', function() {

        //spyOn(controller, 'sendMessage').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(newMessage, 'call').and.returnValue(true);  // mock

        controller.message="hello";
        controller.chatId="4JYG4SMG4gs8HGMSi";
        controller.sendMessage();

        expect(newMessage.call.calls.mostRecent().args[0]).toEqual({
          text: "hello",
          chatId: controller.chatId
        });
      });

      it('should NOT send a message if text empty or null', function() {

        spyOn(controller, 'sendMessage').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(newMessage, 'call').and.returnValue(true);  // mock

        controller.message="";
        controller.sendMessage();

        expect(controller.sendMessage).toHaveBeenCalled();
        expect(newMessage.call).not.toHaveBeenCalled();

        controller.message=null;
        controller.sendMessage();

        expect(controller.sendMessage).toHaveBeenCalled();
        expect(newMessage.call).not.toHaveBeenCalled();
      });

      it('should error if try to send message to non-existant Chat', function() {

        spyOn(newMessage, 'call').and.callThrough(); // go thru validation

        controller.message="hello";
        controller.chatId=null;
    //    controller.sendMessage();

        expect( function() {
          newMessage.call({
            text: "hello",
            chatId: null
          });
        }).toThrowError();
      });

    });


  });
});
