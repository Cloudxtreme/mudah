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
import 'angular-elastic';

const name = 'taskEdit';

class TaskEdit {
  constructor($stateParams, $scope, $reactive, uiService, taskEditService, chatsAddService) {
    'ngInject';


    $reactive(this).attach($scope);

    this.uiService = uiService;


    this.originalTask = _.clone( taskEditService.getTask() );
    this.task = this.originalTask;

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
    if (this.taskEditService.isDirty(this.task) ) {
      this.taskEditService.saveEditedTask(this.task);
    }
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

  hide() {
      this.taskEditService.closeModal();
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
    isDirty: isDirty,
    saveEditedTask : saveEditedTask,
    setAllOptionsFlag : setAllOptionsFlag,
    getAllOptionsFlag : getAllOptionsFlag
  }
  return service;


  function openModal(task) {
    setTask(task);
    setAllOptionsFlag(false);

    var modal = "<task-edit></task-edit>";
    uiService.openEditModal(modal);
  }

  function openModalWithAllOptions(task) {
    setTask(task);
    setAllOptionsFlag(true);

    var modal = "<task-edit></task-edit>";
    uiService.openEditModal(modal);
  }

  function closeModal() {
    uiService.hideEditModal();
  }

  function setTask(task) {
    //currTask={};
    //currTask = _.clone(task);
    currTask = task;

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
    let oldTask = taskHelper.getPermittedTask( task._id);
    //logTask(task,oldTask);
    if (
        compareString(task.name, oldTask.name) && compareString(task.reward, oldTask.reward) &&
        compareString(task.forfeit, oldTask.forfeit)  && compareDate(task.dueDate, oldTask.dueDate) ) {
         console.log("no change");
         return false;
       } else {
         console.log("is dirty");
         return true;
       }

  }

  function compareString(a,b) {
    console.log("---> String a=" + a + "*  b=" + b + "*" );
    return (a===b);
  }

  function compareDate(a,b) {
    console.log("---> Date a=" + a + "*  b=" + b + "*" );

    if (a!=null && b!=null) {
      console.log("date match = " +  a.getTime() == b.getTime() );
      return ( a.getTime() == b.getTime() );
    }
    if (a!=null && b==null) {
      console.log("date dont match");
      return false;
    }
    if (a==null && b!=null) {
      console.log("date dont match");
      return false;
    }

    return false;
  }

  function saveEditedTask(task) {
    let saveTask = {};
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

  function logTask(task,oldTask) {
    console.log("=LOG=");
    console.log("task.name=", task.name + "*");
    console.log("oldTask.name=", oldTask.name + "*");
    console.log("----");
    console.log("task.reward=", task.reward + "*");
    console.log("oldTask.reward=", oldTask.reward + "*");
    console.log("----");
    console.log("task.forfeit=", task.forfeit + "*");
    console.log("oldTask.forfeit=", oldTask.forfeit + "*");
    console.log("----");
    console.log("task.dueDate=", task.dueDate + "*");
    console.log("oldTask.dueDate=", oldTask.dueDate + "*");
  }

/*
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
  */
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  uiService,
  chatsAdd,
  FocusMe,
  'monospaced.elastic',
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: TaskEdit
})
.factory( statusHelper.getServiceName(name), TaskEditService);
