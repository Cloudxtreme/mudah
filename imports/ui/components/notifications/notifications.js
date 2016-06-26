import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';


import { Counts } from 'meteor/tmeasday:publish-counts';
import { name as TaskDetail } from '../taskDetail/taskDetail';
import { name as PromiseListOptions } from '../promiseListOptions/promiseListOptions';
import { name as StatusIcons } from '../statusIcons/statusIcons';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { statusHelper } from '../../helpers/statusHelper';
import { name as EmptyList } from '/imports/ui/directives/emptyList';
import { name as UserPromise } from '/imports/ui/components/userPromise/userPromise';
import { name as PromiseView } from '/imports/ui/components/promiseView/promiseView';
import { name as RequestView } from '/imports/ui/components/requestView/requestView';


import './notifications.html';
const name = 'notifications';

class Notifications {
  constructor($scope, $rootScope, $reactive, $timeout, $location, uiService, promiseViewService, requestViewService) {
    'ngInject';

    this.uiService = uiService;
    this.promiseViewService = promiseViewService;
    this.requestViewService = requestViewService;
    this.$location = $location;

    $reactive(this).attach($scope);

    if ( this.show() ) {
      this.subscribe('tasks', () => [
          'promiseList'
      ]);

      this.helpers({
        tasks() {
            return taskHelper.getActiveList(Meteor.userId());
        }
      });
    };
  }

  show() {
    return Meteor.settings.public.features.allow_tinder_swipe;
  }


  getPhoto(userId) {
    currUser = taskHelper.getUser(userId);
    return this.uiService.getProfilePhoto(currUser);
  }

  destroyed(index) {
    this.tasks.splice(index, 1);
    console.log("AFTER card destroyed length=", this.tasks.length);
  };


  swipeLeft(index) {
    console.log("swipe LEFT <-----");
  }

  swipeRight(index) {
    console.log("swipe -----> RIGHT");
  }

  refreshCards() {
    // make a unique url so that page refreshes
    const tmp = '/tab/notice/' + new Date().getTime() ;
    this.$location.path( tmp);
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  StatusIcons,
  TaskDetail,
  PromiseListOptions,
  EmptyList,
  UserPromise,
  PromiseView,
  RequestView
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Notifications
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('tab.notice', {
      url: '/notice/:date',
      views: {
        'tab-notice': {
          template: '<notifications></notifications>'
        }
      },
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) {
            return $q.reject('AUTH_REQUIRED');
          } else {
            return $q.resolve();
          }
        }
      }
    });
}
