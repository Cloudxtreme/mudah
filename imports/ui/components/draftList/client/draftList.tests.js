import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import { name as DraftList } from '../draftList';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { addTask } from '/imports/api/methods/taskMethods';
import { name as uiService } from '/imports/ui/services/uiService';

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

describe('DraftList', function() {
  beforeEach(() => {
    //window.module(TaskEdit);
    angular.mock.module(DraftList);
    angular.mock.module(uiService);
  });

  describe('controller', function() {


    const newTask = {
      _id: '4JYG4SMG4gs8HGMSi',
      name: 'Foo-changed-this-value',
      reward: '1000-changed',
      forfeit: '200',
      dueDate: '01/01/2001'
    };

    const oldTask = {
      _id: '4JYG4SMG4gs8HGMSi',
      name: 'Foo',
      reward: '100',
      forfeit: '200',
      dueDate: '01/01/2001'
    };
    let controller;
    let uiService;

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

             testUiService = {
                 comingSoon: function () {
                    console.log("hello world");
                 }
             };


      inject(
        function($rootScope, $componentController, _$stateParams_,_$reactive_, _uiService_) {

          controller = $componentController(DraftList, {
            $scope: $rootScope.$new(true),
            $stateParams: _$stateParams_,
            $reactive: _$reactive_,
          //  uiService : testUiService
            uiService  : _uiService_
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

      it('should add a new Task if task name is supplied', function() {

        spyOn(controller, 'create').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(addTask, 'call').and.returnValue(true);  // mock
        spyOn(controller, 'init');

        controller.taskName = "this is a new task";
        controller.create();

        expect(controller.create).toHaveBeenCalled();
        expect(addTask.call).toHaveBeenCalled();
        expect(controller.init).toHaveBeenCalled();
      });

      it('should reject if task name is not supplied', function() {

        spyOn(controller, 'create').and.callThrough();        // must use callThrough() when testing controllers !!!
        spyOn(addTask, 'call').and.returnValue(true);  // mock

        controller.taskName = "";
        controller.create();

        expect(controller.create).toHaveBeenCalled();
        expect(addTask.call).not.toHaveBeenCalled();

        controller.taskName = null;
        controller.create();

        expect(controller.create).toHaveBeenCalled();
        expect(addTask.call).not.toHaveBeenCalled();
      });

    });


  });
});
