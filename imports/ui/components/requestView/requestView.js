import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { name as RequestViewOptions } from '/imports/ui/components/requestViewOptions/requestViewOptions';

import './requestView.html';

const name = 'requestView';

class RequestView {
  constructor($stateParams, $scope, $reactive, requestViewService, uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.requestViewService = requestViewService;


    this.task = requestViewService.getTask();

    this.creator = taskHelper.getUser(this.task.creator);
    this.creatorPhoto = uiService.getProfilePhoto(this.creator);

    creator = taskHelper.getUser(this.task.creator);
    firstName = statusHelper.getFirstName(creator.profile.name);

    this.typeLabel=  firstName + "'s Request";
  }


  hide() {
      this.requestViewService.closeModal();
  }

}


function RequestViewService(uiService) {
  'ngInject';
  let currTask=null;

  var service = {
    openModal: openModal,
    closeModal: closeModal,
    setTask: setTask,
    getTask : getTask
  }
  return service;


  function openModal(task) {
    setTask(task);
    var modal = "<request-view></request-view>";
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
}

// create a module
export default angular.module(name, [
    angularMeteor,
    RequestViewOptions
  ]).component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: RequestView
  })
.factory( statusHelper.getServiceName(name), RequestViewService);
