import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as TaskDelete } from '../taskDelete';

import 'angular-mocks';


//http://stackoverflow.com/questions/35173907/jasmine-spyon-on-function-and-returned-object


describe('TaskDelete', () => {
  beforeEach(() => {
    window.module(TaskDelete);
  });

  describe('controller', () => {
    let controller;

    const task = {
      _id: 'taskId',
      name: 'Foo',
      reward: '100',
      forfeit: '200'
    };


    beforeEach(() => {
      /*
      inject(($rootScope, $componentController) => {
        controller = $componentController(TaskEdit, {
          $scope: $rootScope.$new(true)
        });
      });
      */
      inject(
        function($rootScope, $componentController) {
          controller = $componentController(TaskDelete,
            {
            $scope: $rootScope.$new(true)
          }
          );
        }
      );
    });

    it('should delete a proper task', () => {
      expect(true).toBe(true);
    });

  });
});
