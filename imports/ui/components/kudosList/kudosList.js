import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { Counts } from 'meteor/tmeasday:publish-counts';

import './kudosList.html';

import { Tasks } from '../../../api/tasks';
import { name as StatusIcons } from '../statusIcons/statusIcons';
import { name as EmptyList } from '/imports/ui/directives/emptyList';
import { name as TaskDetail } from '../taskDetail/taskDetail';
import { name as WatchListOptions } from '../watchListOptions/watchListOptions';

import { statusHelper } from '../../helpers/statusHelper';

const name = 'kudosList';

class KudosList {
  constructor($scope, $reactive, uiService,taskDetailService) {
    'ngInject';

    this.uiService = uiService;
    this.taskDetailService = taskDetailService;

    this.load($scope, $reactive);
  }

  load($scope, $reactive) {

    $reactive(this).attach($scope);

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
        return taskHelper.getKudosList(Meteor.userId());
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
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
  StatusIcons,
  EmptyList,
  TaskDetail,
  WatchListOptions
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: KudosList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('tab.kudosList', {
      url: '/kudosList',
      views: {
        'tab-promise': {
          template: '<kudos-list></kudos-list>'
        }
      },
    });
}
