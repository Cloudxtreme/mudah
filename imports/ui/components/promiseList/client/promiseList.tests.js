import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as PromiseList } from '../promiseList';
import { taskHelper } from '/imports/api/methods/taskHelper';
import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

let reactiveResult;
let $reactiveMock;
let $scopeMock;


describe('PromiseList', function() {
  beforeEach(() => {
    angular.mock.module(PromiseList);
  });

  describe('controller', function() {
    let controller;
    // mocks

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController, _$reactive_) {

          controller = $componentController(PromiseList, {
            $scope: $rootScope.$new(true),
            $reactive: _$reactive_
          });
        }
      );

    });

    describe('load()', function() {

      beforeEach(function() {
         reactiveResult = jasmine.createSpyObj('reactiveResult', ['attach']);
         $reactiveMock = jasmine.createSpy('$reactive').and.returnValue(reactiveResult);
         $scopeMock = jasmine.createSpy('$scope');
      });

      it('should init with $reactive', function() {
        // see: http://stackoverflow.com/questions/35173907/jasmine-spyon-on-function-and-returned-object/35224992
        controller.load($scopeMock, $reactiveMock);
        expect($reactiveMock).toHaveBeenCalledWith(controller);
      });

      it('should subscribe to Tasks', function() {

        spyOn(controller, 'subscribe');
        controller.load($scopeMock, $reactiveMock);
        expect(controller.subscribe.calls.mostRecent().args[0]).toEqual('tasks');
      });

      it('should return list of active Tasks for the user', function() {
        spyOn(taskHelper, 'getActiveList');
        spyOn(Meteor, 'userId').and.returnValue("KeaXDfpTMaX23c4tt");
        controller.load($scopeMock, $reactiveMock);
        expect(taskHelper.getActiveList).toHaveBeenCalledWith( Meteor.userId() );
      });

    });



  });
});
