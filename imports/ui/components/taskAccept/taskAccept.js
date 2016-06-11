import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskAccept.html';
import { name as TaskEdit } from '../taskEdit/taskEdit';

import {  statusHelper } from '../../helpers/statusHelper';
import {updateStatus} from '/imports/api/methods/taskMethods';

const name = 'taskAccept';

class TaskAccept {
  constructor($scope, taskEditService, uiService) {
    'ngInject';
    this.taskEditService = taskEditService;
    this.uiService = uiService;
  }


  action() {
    this.uiService.hideOptions(this.isButton());

    if ( this.isButton()==false && statusHelper.noDueDate(this.task)  ) {  // call from list button-option
        this.taskEditService.openModalWithAllOptions(this.task);
    }

    this.taskEditService.saveEditedTask(this.task);

    newStatus = statusHelper.getNextStatus(name, this.task.status);

    updateStatus.call({
      taskId: this.task._id,
      newStatus: newStatus
    }, (err, res) => {
      if (err) {
        console.log("Error found.....back in client");
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
      /* not required
      if (this.task.status==statusHelper.status.REVOKED && this.task.creator===Meteor.userId() ) {
        return true; // your own task that has been un-shared. you can take it on for yourself
      }
      */
      if (this.task.status == statusHelper.status.PENDING && this.wasEditedByThirdParty()) {
        return true;
      }
    }

    return false;
  }

  wasEditedByThirdParty() {
  //  return (statusHelper.isParticipant(this.task) && this.task.edited && this.task.editedBy != Meteor.userId());
    if ( statusHelper.isParticipant(this.task) || statusHelper.isCreator(this.task) ) {
      return (this.task.edited && this.task.editedBy != Meteor.userId());
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
    buttonStyle: '@'
  },
  controllerAs: name,
  controller: TaskAccept
})
