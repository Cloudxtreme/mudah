import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Counts } from 'meteor/tmeasday:publish-counts';

import './completedList.html';

import { Tasks } from '../../../api/tasks';
import { name as TaskDelete } from '../taskDelete/taskDelete';
import { name as StatusIcons } from '../statusIcons/statusIcons';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { statusHelper } from '../../helpers/statusHelper';
import { name as TaskDetail } from '../taskDetail/taskDetail';
import { name as PromiseListOptions } from '../promiseListOptions/promiseListOptions';
import { name as EmptyList } from '/imports/ui/directives/emptyList';

const name = 'completedList';

class CompletedList {
  constructor($scope, $reactive, taskDetailService, uiService) {
    'ngInject';

    this.taskDetailService = taskDetailService;
    this.uiService = uiService;
    $reactive(this).attach($scope);

    this.load();
  }

  load() {

    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('tasks', () => [{
      //  limit: parseInt(this.perPage),
      //  skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);


    this.helpers({
      tasks() {
        return taskHelper.getCompletedList(Meteor.userId());
      }
    });
  }

  openDetail($event, task) {
    this.uiService.stopFurtherClicks($event);
    this.taskDetailService.openModal(task, this.taskDetailService.promiseListOptions);
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskDelete,
  StatusIcons,
  TaskDetail,
  PromiseListOptions,
  EmptyList
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: CompletedList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('tab.completedList', {
      url: '/completedList',
      views: {
        'tab-promise': {
          template: '<completed-list></completed-list>'
        }
      },
    });
}
