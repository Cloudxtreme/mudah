import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import './taskShare.html';

import { Tasks } from '../../../api/tasks';
import { name as chatsAdd } from '../chatsAdd/chatsAdd';
import { name as TaskEdit } from '../taskEdit/taskEdit';
import { statusHelper } from '../../helpers/statusHelper';
import { name as dueDateEdit } from '../dueDateEdit/dueDateEdit';

const name = 'taskShare';

class TaskShare {
  constructor($scope, uiService, chatsAddService,dueDateEditService, taskEditService) {
    'ngInject';

    this.uiService = uiService;
    this.chatsAddService = chatsAddService;
    this.dueDateEditService = dueDateEditService;
    this.taskEditService = taskEditService;
  }

  action() {
    if ( this.close ) {
      this.uiService.hideOptions(this.isButton(), true, true); // close the Edit Modal
    } else {
      this.uiService.hideOptions(this.isButton() ); // close Modal,depending on config
    }

    if ( this.isButton()==false && statusHelper.noDueDate(this.task)  ) {  // call from list button-option
        this.taskEditService.openModalWithAllOptions(this.task);
    } else {
      if (this.taskEditService.isDirty(this.task) ) {
        this.taskEditService.saveEditedTask(this.task);
      }
      this.chatsAddService.openModal(this.task._id, this.task.name, "share");
    }

  }

  show() {
    //  ||   statusHelper.noDueDate(this.task)

    if (statusHelper.isOffline()|| statusHelper.allow(this.task, name)==false ) {
      return false
    };


    return true;
  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }

  disable() {
    return ( this.task.dueDate==null);
  }
}


function TaskShareService($rootScope, $state) {
  'ngInject';

  var service = {
    doUpdate: doUpdate
  }
  return service;

  // function implementations
  function doUpdate(task) {
    // do nothing
    console.log("TaskShareService taskId=" + task._id);
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  chatsAdd,
  dueDateEdit,
  TaskEdit
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@',
    close: '@'
  },
  controllerAs: name,
  controller: TaskShare
})
.config(config)
.factory( statusHelper.getServiceName(name), TaskShareService);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('tab.taskShare', {
    url: '/taskShare/:taskId',
    views: {
      'tab-promise': {
          template: '<task-share></task-share>'
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
