import angular from 'angular';
import angularMeteor from 'angular-meteor';
import './promiseView.html';


import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';


const name = 'promiseView';

class PromiseView {
  constructor($stateParams, $scope, $reactive, promiseViewService, uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.service = promiseViewService;


    this.task = promiseViewService.getTask();

    this.creator = taskHelper.getUser(this.task.creator);
    this.creatorPhoto = uiService.getProfilePhoto(this.creator);

    creator = taskHelper.getUser(this.task.creator);
    firstName = statusHelper.getFirstName(creator.profile.name);

    this.typeLabel=  firstName + "'s Promise";
  }


  destroy() {
    console.log("destroy--- ");
    this.service.closeModal();
  }

  accept() {
    console.log("accept... !! ");
  }

  reject() {
    console.log(" reject ");
  }
}


function PromiseViewService(uiService) {
  'ngInject';
  let currTask=null;
  let currOptions="promiseListOptions"; // or requestViewOptions

  var service = {
    openModal: openModal,
    closeModal: closeModal,
    setTask: setTask,
    getTask : getTask,
    setOptions : setOptions,
    getOptions : getOptions,
    isPromiseListOptions : isPromiseListOptions,
    isRequestViewOptions : isRequestViewOptions
  }
  return service;


  function openModal(task, options) {
    if (options!=null) {
      setOptions(options)
    }
    setTask(task);
    var modal = "<promise-view></promise-view>";
    uiService.openModal(modal);
  }

  function closeModal() {
    uiService.hideModal();
  }

  function setTask(task) {
    currTask = task;  // point to the Task. Do not clone as task buttons won't be reactive
  }

  function getTask() {
    return currTask;
  }

  function setOptions(options) {
    currOptions = options;
  }

  function getOptions() {
    return currOptions;
  }

  function isPromiseListOptions() {
      return ( getOptions() =="promiseListOptions" );
  }
  function isRequestViewOptions() {
    return ( getOptions() =="requestViewOptions" );
  }
}

// create a module
export default angular.module(name, [
    angularMeteor
  ]).component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: PromiseView
  })
.factory( statusHelper.getServiceName(name), PromiseViewService);
