import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskAccept.html';
import { name as TaskEdit } from '../taskEdit/taskEdit';

import {  statusHelper } from '../../helpers/statusHelper';
import {acceptTask} from '/imports/api/methods/taskMethods';

const name = 'taskAccept';

class TaskAccept {
  constructor($scope, taskEditService, uiService) {
    'ngInject';
    this.taskEditService = taskEditService;
    this.uiService = uiService;
  }


  action() {
    if ( this.close ) {
      console.log("--close the Modals---");
      this.uiService.hideOptions(this.isButton(), true, true); // close the Edit Modal
      this.uiService.hideOptions(this.isButton(),true ); // close Modal,depending on config
    }

    if (  statusHelper.noDueDate(this.task) ) {  // call from list button-option
        this.taskEditService.openModalForDate(this.task);
        return;
    }

    // if user updated the task, then pressed 'Accept', save the task first
    if (this.taskEditService.isDirty(this.task) ) {
      this.taskEditService.saveEditedTask(this.task);
    }

    acceptTask.call({
        taskId: this.task._id
      }, (err, res) => {
        if (err) {
          console.log("Error .....back in client");
          alert(err);
        } else {
          // success!
        }
    });


  }


  isButton() {
    //console.log("task accept button=", this.buttonStyle);
    //console.log("isButton=", statusHelper.isButton(this.buttonStyle) );

    return statusHelper.isButton(this.buttonStyle);
  }

  disable() {
    return ( this.task.dueDate==null);
  }

  show() {

    if (statusHelper.isOffline()  ) {
      return false
    };

    if (statusHelper.isPrivateTask(this.task)) {
      if (this.task.status == statusHelper.status.DRAFT) {
        return true;
      }
    } else {
      if (this.task.status == statusHelper.status.PENDING && statusHelper.wasEditedByThirdParty(this.task)) {
        return true;
      }
    }

    return false;
  }



}


// create a module
export default angular.module(name, [
  angularMeteor,
  TaskEdit
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@',
    close: '@'
  },
  controllerAs: name,
  controller: TaskAccept
})
