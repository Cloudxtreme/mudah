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
import { name as UserPromise } from '/imports/ui/directives/userPromise';
import { name as PromiseView } from '/imports/ui/components/promiseView/promiseView';
import { name as RequestView } from '/imports/ui/components/requestView/requestView';

import './promiseList.html';

const name = 'promiseList';

class PromiseList {
  constructor($scope, $rootScope, $reactive, uiService,taskDetailService, promiseViewService, requestViewService) {
    'ngInject';

    this.uiService = uiService;
    this.taskDetailService=taskDetailService;
    this.promiseViewService = promiseViewService;
    this.requestViewService = requestViewService;

    this.load($scope, $reactive);

  }

  load($scope, $reactive) {

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('tasks', () => [
      //  limit: parseInt(this.perPage),
      //  skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        'promiseList'
    ]);

    this.helpers({
      tasks() {
        return taskHelper.getActiveList(Meteor.userId());
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });

    this.autorun(() => {
      this.isOnline = Meteor.status().connected;
      console.log('Autorun - status changed, isOnline=', this.isOnline );
    });
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }

  openDetail($event, task) {
    this.uiService.stopFurtherClicks($event);
    if ( task.isRequest() ) {
      //this.taskDetailService.openModal(task, this.taskDetailService.promiseListOptions);
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
  controller: PromiseList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('tab.promiseList', {
      url: '/promiseList',
      views: {
        'tab-promise': {
          template: '<promise-list></promise-list>'
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
