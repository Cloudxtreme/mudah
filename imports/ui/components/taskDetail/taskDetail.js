import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import {  Meteor } from 'meteor/meteor';

import './taskDetail.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { name as WatchListOptions } from '../watchListOptions/watchListOptions';

const name = 'taskDetail';

class TaskDetail {
  constructor($stateParams, $scope, $reactive, taskDetailService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.taskDetailService = taskDetailService;

    this.task = taskDetailService.getTask();
    this.whichOption = taskDetailService.getWhichOption();
  }

  showWatchListOptions() {
      if ( this.whichOption == this.taskDetailService.watchListOptions ) {
        return true;
      }
      return false;
  }

  showPromiseListOptions() {
      if ( this.whichOption == this.taskDetailService.promiseListOptions ) {
        return true;
      }
      return false;
  }

  action() {
    // do nothing
  }

}


function TaskDetailService(uiService) {
  'ngInject';
  let currTask=null;
  let whichOption= "promistListOptions";

  var service = {
    openModal: openModal,
    closeModal: closeModal,
    setTask: setTask,
    getTask : getTask,
    setWhichOption : setWhichOption,
    getWhichOption : getWhichOption,
    promistListOptions : "promistListOptions",
    watchListOptions : "watchListOptions"
  }
  return service;



  function openModal(task, whichOption) {
    setTask(task);
    setWhichOption(whichOption);
    var modal = "<task-detail></task-detail>";
    uiService.openModal(modal);
  }

  function closeModal() {
    uiService.hideModal();
  }

  function setTask(task) {
    currTask={};
    currTask = _.clone(task);

    console.log("taskDetailService, set task");
    console.log(task);
  }

  function getTask() {
    return currTask;
  }

  function setWhichOption(choice) {
    return whichOption = choice;
  }

  function getWhichOption() {
    return whichOption;
  }

}

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    WatchListOptions
  ]).component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: TaskDetail
  })
.factory( statusHelper.getServiceName(name), TaskDetailService);
