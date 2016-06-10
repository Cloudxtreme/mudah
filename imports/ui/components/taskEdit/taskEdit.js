import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import './taskEdit.html';


import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { updateTask } from '/imports/api/methods/taskMethods';
import { name as uiService } from '/imports/ui/services/uiService';
import { name as chatsAdd } from '../chatsAdd/chatsAdd';
import { name as FocusMe } from '/imports/ui/directives/focusMe';

import _ from 'underscore';
import moment from 'moment';

const name = 'taskEdit';

class TaskEdit {
  constructor($stateParams, $scope, $reactive, uiService, taskEditService, chatsAddService) {
    'ngInject';


    $reactive(this).attach($scope);

    this.uiService = uiService;

    this.task = taskEditService.getTask();
    this.taskEditService = taskEditService;
    this.chatsAddService = chatsAddService;
    this.showAllOptions =taskEditService.getAllOptionsFlag();

    this.minDate = new Date();


/*
    this.autorun(() => {
      console.log('Autorun!! taskName has changed taskName=', this.getReactively('this.task.name'));
    });
*/
  }

  save() {
    this.taskEditService.saveEditedTask(this.task);
    this.taskEditService.closeModal();
  }


  setDefaultDueDate() {
    let newDate = moment().add(7, 'days').toDate(); // tomorrow
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    //return tmrwDate;

    this.task.dueDate = newDate;
  }


  isCreator() {
    console.log("is creator = " + statusHelper.isCreator(this.task));
    return statusHelper.isCreator(this.task);
  }
}


function TaskEditService(uiService) {
  'ngInject';
  let currTask=null;
  let allOptionsFlag=false;

  var service = {
    openModal: openModal,
    openModalWithAllOptions: openModalWithAllOptions,
    closeModal: closeModal,
    setTask: setTask,
    getTask : getTask,
    saveEditedTask : saveEditedTask,
    setAllOptionsFlag : setAllOptionsFlag,
    getAllOptionsFlag : getAllOptionsFlag
  }
  return service;


  function openModal(task) {
    setTask(task);
    setAllOptionsFlag(false);

    var modal = "<task-edit></task-edit>";
    uiService.openModal(modal);
  }

  function openModalWithAllOptions(task) {
    setTask(task);
    setAllOptionsFlag(true);

    var modal = "<task-edit></task-edit>";
    uiService.openModal(modal);
  }

  function closeModal() {
    uiService.hideModal();
  }

  function setTask(task) {
    currTask={};
    currTask = _.clone(task);

    console.log("set task");
    console.log(task);
  }

  function getAllOptionsFlag() {
    return allOptionsFlag;
  }

  function setAllOptionsFlag(flag) {
    allOptionsFlag = flag
  }

  function getTask() {
    return currTask;
  }

  function isDirty(task) {
    if (  task.name != oldTask.name ||
          task.reward != oldTask.reward ||
          task.forfeit != oldTask.forfeit ||
          task.dueDate != oldTask.dueDate ) {
        return true;
    } else {
        return false;
    }
  }

  function saveEditedTask(task) {

    oldTask = taskHelper.getPermittedTask( task._id);

    if (  isDirty(task) ) {
      saveTask = {};
      saveTask._id = task._id;
      saveTask.name = task.name;
      saveTask.reward = task.reward;
      saveTask.forfeit = task.forfeit;
      saveTask.dueDate = task.dueDate;
      saveTask.neverCountered = task.neverCountered;
      saveTask.userIds = task.userIds;

      updateTask.call({
        task: saveTask
      }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          // success!
        }
      });
    }
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  uiService,
  chatsAdd,
  FocusMe
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: TaskEdit
})
.factory( statusHelper.getServiceName(name), TaskEditService);
