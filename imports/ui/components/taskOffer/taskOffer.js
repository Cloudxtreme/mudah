import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import './taskOffer.html';

import { statusHelper } from '../../helpers/statusHelper';
import { name as TaskEdit } from '../taskEdit/taskEdit';

const name = 'taskOffer';

class TaskOffer {
  constructor($scope, $reactive, $state, $stateParams, uiService, taskEditService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.uiService = uiService;
    this.taskEditService = taskEditService;
  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }

  show() {
    if (statusHelper.isOffline() ) { return false};

    neverFlag = this.getReactively('this.task.neverCountered');

    if ( this.task.status == statusHelper.status.PENDING  ) {
        if ( neverFlag==true && this.task.creator==Meteor.userId() ) {
          this.buttonLabel = "Edit";
        } else {
          this.buttonLabel = "Offer";
        }

      return true;
    }

    if ( this.task.status == statusHelper.status.REVOKED && statusHelper.isCreator(this.task) ) {
      this.buttonLabel = "Edit";

      return true;
    }
    return false;
  }

  action() {
    //this.uiService.goState('tab.taskEdit', { "taskId": this.task._id});
    if ( this.isButton() ) {
      this.uiService.hideModal();
    }
    this.taskEditService.openModal(this.task);
  }

}

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskEdit
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@'
  },
  controllerAs: name,
  controller: TaskOffer
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('tab.taskOffer', {
    url: '/taskOffer/:taskId',
    views: {
      'tab-promise': {
          template: '<task-offer></task-offer>'
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
