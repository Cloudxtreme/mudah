import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import './taskRequest.html';

import { Tasks } from '../../../api/tasks';
import { name as chatsAdd } from '../chatsAdd/chatsAdd';
import { name as TaskEdit } from '../taskEdit/taskEdit';
import { statusHelper } from '../../helpers/statusHelper';

const name = 'taskRequest';

class TaskRequest {
  constructor($scope, uiService, chatsAddService, taskEditService) {
    'ngInject';

    this.uiService = uiService;
    this.chatsAddService = chatsAddService;
    this.taskEditService = taskEditService;
  }

  action() {
    if ( this.close ) {
      this.uiService.hideOptions(this.isButton(), true, true); // close the Edit Modal
    } else {
      this.uiService.hideOptions(this.isButton() ); // close Modal,depending on config
    }

    if ( this.isButton()==false && statusHelper.noDueDate(this.task)  ) {  // call from list button-option
      this.taskEditService.openModalForDate(this.task);
      return;
    } else {
      if (this.taskEditService.isDirty(this.task) ) {
        this.taskEditService.saveEditedTask(this.task);
      }
      this.chatsAddService.openRequest(this.task);
    }

  }

  show() {
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




// create a module
export default angular.module(name, [
  angularMeteor,
  chatsAdd,
  TaskEdit
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@',
    close: '@'
  },
  controllerAs: name,
  controller: TaskRequest
})
