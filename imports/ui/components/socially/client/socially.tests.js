import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as Socially } from '../socially';
import { taskHelper } from '/imports/api/methods/taskHelper';
import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

let reactiveResult;
let $reactiveMock;
let $scopeMock;


describe('Socially', function() {
  beforeEach(() => {
    angular.mock.module(Socially);
  });

  describe('controller', function() {
    let controller;
    // mocks

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController, _$reactive_) {

          controller = $componentController(Socially, {
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


      it('should subscribe to Users', function() {

        spyOn(controller, 'subscribe');
        controller.load();
        expect(controller.subscribe.calls.mostRecent().args[0]).toEqual('users');
      });

    });



  });
});
