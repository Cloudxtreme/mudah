import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { name as uiService } from '/imports/ui/services/uiService';

import { name as Auth } from '../auth';

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

describe('Auth', function() {
  beforeEach(() => {
    //window.module(TaskEdit);
    angular.mock.module(Auth);
    angular.mock.module(uiService);
  });

  describe('controller', function() {
    let controller;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {


      inject(
        function($rootScope, $componentController,_$reactive_, _uiService_) {

          controller = $componentController(Auth, {
            $scope: $rootScope.$new(true),
            $reactive: _$reactive_,
            uiService  : _uiService_
            }
          );
        }
      );
    });

    describe('logout()', function() {

      it('should logout gracefully', function() {

        spyOn(Meteor, 'logout').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(Accounts, 'logout').and.returnValue(true);  // mock
        spyOn(controller.uiService, 'goGuestpage');

        controller.logout();

        expect(Meteor.logout).toHaveBeenCalled();
        expect(Accounts.logout).toHaveBeenCalled();
        expect(controller.uiService.goGuestpage).toHaveBeenCalled();
      });


    });


  });
});
