import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as Login } from '../login';
import { name as uiService } from '/imports/ui/services/uiService';

import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

describe('Login', function() {
  beforeEach(() => {
    angular.mock.module(Login);
    angular.mock.module(uiService);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController, _$state_, _uiService_) {

          controller = $componentController(Login, {
            $scope: $rootScope.$new(true),
            $state: _$state_,
            uiService: _uiService_
          }
          );
        }
      );

    });

    describe('login()', function() {

      it('should login with email and password', function() {
        spyOn(Meteor, 'loginWithPassword');


        let credentials = { email : "tom@test.com", password: "hello"};
        controller.credentials = credentials;
        controller.login();

        expect(Meteor.loginWithPassword.calls.mostRecent().args[0]).toEqual(credentials.email);
        expect(Meteor.loginWithPassword.calls.mostRecent().args[1]).toEqual(credentials.password);
      });


    });


  });
});
