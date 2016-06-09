import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as Password } from '../password';
import { name as uiService } from '/imports/ui/services/uiService';
import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

describe('Password', function() {
  beforeEach(() => {
    angular.mock.module(Password);
    angular.mock.module(uiService);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController, _$state_, _uiService_) {

          controller = $componentController(Password, {
            $scope: $rootScope.$new(true),
            $state: _$state_,
            uiService: _uiService_
          }
          );
        }
      );

    });

    describe('reset()', function() {

      it('should reset password with email', function() {
        spyOn(Accounts, 'forgotPassword');

        let credentials = { email : "tom@test.com"};
        controller.credentials = credentials;
        controller.reset();

        expect(Accounts.forgotPassword.calls.mostRecent().args[0]).toEqual(credentials);
      });

      

    });


  });
});
