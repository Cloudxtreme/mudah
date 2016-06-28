import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskAccept.html';
import { name as TaskEdit } from '../taskEdit/taskEdit';

import {  statusHelper } from '../../helpers/statusHelper';

const name = 'taskAccept';

class TaskAccept {
  constructor($scope,$reactive, taskEditService, uiService) {
    'ngInject';
    this.taskEditService = taskEditService;
    this.uiService = uiService;
    $reactive(this).attach($scope);
  }


  action() {
    if ( this.close ) {
      this.uiService.hideOptions(this.isButton(), true, true); // close the Edit Modal
      this.uiService.hideOptions(this.isButton(),true ); // close Modal,depending on config
    }

    if ( this.task.hasDueDate()==false ) {  // call from list button-option
        this.taskEditService.openModalForDate(this.task);
        return;
    }
console.log("check if dirty task");

    // if user updated the task, then pressed 'Accept', save the task first
    if (this.taskEditService.isDirty(this.task) ) {
console.log("save edited task");
      this.taskEditService.saveEditedTask(this.task);
    }
console.log("call accept task");

    this.call('acceptTask', {
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

    if ( this.task.isPrivate() ) {
      if (this.task.status == statusHelper.status.DRAFT) {
        return true;
      }
    } else {
      if (this.task.status == statusHelper.status.PENDING && statusHelper.isMyTurnToRespond(this.task)) {
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
