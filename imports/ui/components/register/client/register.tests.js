import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as Register } from '../register';
import { name as uiService } from '/imports/ui/services/uiService';

import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

describe('Register', function() {
  beforeEach(() => {
    angular.mock.module(Register);
    angular.mock.module(uiService);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController, _$state_, _uiService_) {

          controller = $componentController(Register, {
            $scope: $rootScope.$new(true),
            $state: _$state_,
            uiService: _uiService_
          }
          );
        }
      );

    });

    describe('register()', function() {

      it('should register with credentials', function() {
        spyOn(Accounts, 'createUser');

        let credentials = {
          email: 'tom@test.com',
          password: 'hello',
          profile : { name:'Tom Jones'}
        };
        controller.credentials = credentials;
        controller.register();

        expect(Accounts.createUser.calls.mostRecent().args[0]).toEqual(credentials);
      });

  
    });


  });
});
