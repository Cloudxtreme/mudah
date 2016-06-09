import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as MeteorStatus } from '../meteorStatus';

import 'angular-mocks';


describe('MeteorStatus', function() {
  beforeEach(() => {
    angular.mock.module(MeteorStatus);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach( function() {

      inject(
        function($rootScope, $componentController, _$reactive_) {

          controller = $componentController(MeteorStatus, {
            $scope: $rootScope.$new(true),
            $reactive: _$reactive_
          }
          );
        }
      );

    });

    describe('disconnect()', function() {

      it('should disconnect when called', function() {
          spyOn(Meteor, 'loginWithPassword');

        controller.disconnect();
      //  expect(Meteor.disconnect).toHaveBeenCalled();
      });


    });


  });
});
