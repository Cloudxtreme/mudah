import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Counts } from 'meteor/tmeasday:publish-counts';

import './watchList.html';

import { name as WatchListOptions } from '../watchListOptions/watchListOptions';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { name as TaskDetail } from '../taskDetail/taskDetail';
import { name as EmptyList } from '/imports/ui/directives/emptyList';
import { name as UserPromise } from '/imports/ui/directives/userPromise';

const name = 'watchList';

class WatchList {
  constructor($scope, $reactive, uiService, taskDetailService, chatService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.uiService = uiService;
    this.taskDetailService = taskDetailService;
    this.chatService = chatService;

    this.load();
  }

  load() {

    this.subscribe('tasks', () => [
      //  limit: parseInt(this.perPage),
      //  skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        'watchList'
    ]);

    this.helpers({
      tasks() {
        //return Tasks.find({}, {
        return taskHelper.getWatchList(Meteor.userId());
      },
      tasksCount() {
        return Counts.get('numberOfTasks');
      }
    });
  }

  openDetail($event, task) {
    this.uiService.stopFurtherClicks($event);
    this.taskDetailService.openModal(task, this.taskDetailService.watchListOptions);
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskDetail,
  EmptyList,
  WatchListOptions,
  UserPromise
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: WatchList
})
.config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('tab.watchList', {
      url: '/watchList',
      views: {
        'tab-watch': {
          template: '<watch-list></watch-list>'
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
