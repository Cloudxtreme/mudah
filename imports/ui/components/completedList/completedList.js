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
import { name as PromiseListOptions } from '../promiseListOptions/promiseListOptions';
import { name as EmptyList } from '/imports/ui/directives/emptyList';
import { name as PromiseView } from '/imports/ui/components/promiseView/promiseView';
import { name as RequestView } from '/imports/ui/components/requestView/requestView';

const name = 'completedList';

class CompletedList {
  constructor($scope, $reactive, uiService, promiseViewService, requestViewService) {
    'ngInject';

    this.promiseViewService = promiseViewService;
    this.requestViewService = requestViewService;
    this.uiService = uiService;
    $reactive(this).attach($scope);

    this.load();
  }

  load() {

    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('tasks', () => [
      'promiseList'
    ]);


    this.helpers({
      tasks() {
        console.log("user = " , Meteor.userId());
        return taskHelper.getCompletedList(Meteor.userId());
      }
    });
  }

  openDetail($event, task) {
    this.uiService.stopFurtherClicks($event);
    if ( task.isRequest() ) {
      this.requestViewService.openModal(task);
    } else {
      this.promiseViewService.openModal(task, "promiseListOptions");
    }
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskDelete,
  StatusIcons,
  PromiseListOptions,
  EmptyList,
  PromiseView,
  RequestView
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
