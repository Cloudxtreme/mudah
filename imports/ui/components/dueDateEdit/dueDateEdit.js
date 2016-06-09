import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './dueDateEdit.html';

import { statusHelper } from '../../helpers/statusHelper';
import moment from 'moment';
import { updateDueDate } from '../../../api/methods/taskMethods.js';


const name = 'dueDateEdit';

class DueDateEdit {
  constructor($scope, dueDateEditService) {
    'ngInject';

    this.dueDateEditService= dueDateEditService;

    this.currTask = this.dueDateEditService.getTask();
    //this.dueDate = this.getDueDate(this.currTask);
  }

  getDueDate(currTask) {
    if ( currTask.dueDate ==null) {
      return this.getDefaultDueDate();
    }

    return currTask.dueDate
  }

  action() {
      this.closeModal(); // easier to mock this!


      this.currTask.reward = this.reward;
      this.currTask.forfeit = this.forfeit;
      this.currTask.dueDate = this.dueDate;

      console.log("this task=");
      console.log(this.currTask);
      
/*
      updateDueDate.call({
        taskId: this.currTask._id,
        dueDate : this.dueDate
      }, (err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          // success!
        }
      });
      */
  }

  getDefaultDueDate() {
    let tmrwDate = moment().add(1, 'days').toDate(); // tomorrow
    tmrwDate.setSeconds(0);
    tmrwDate.setMilliseconds(0);
    return tmrwDate;
  }

  closeModal() {
    this.dueDateEditService.closeModal();
  }

  handleError(err) {
    alert(err);
  }
}


function dueDateEditService(uiService) {
  'ngInject';
  currTask=null;

  var service = {
    openModal: openModal,
    closeModal: closeModal,
    setTask: setTask,
    getTask : getTask
  }
  return service;


  function openModal(task) {
    setTask(task);
    var modal = "<due-date-edit></due-date-edit>";
    uiService.openModal(modal);
  }

  function closeModal() {
    uiService.hideModal();
  }

  function setTask(task) {
    currTask=task;
  }
  function getTask() {
    return currTask;
  }
}


// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<'
  },
  controllerAs: name,
  controller: DueDateEdit
})
.factory( statusHelper.getServiceName(name), dueDateEditService);
