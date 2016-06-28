import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { name as RequestViewOptions } from '/imports/ui/components/requestViewOptions/requestViewOptions';
import { name as ShowUser } from '/imports/ui/components/showUser/showUser';


import './requestView.html';

const name = 'requestView';

class RequestView {
  constructor($stateParams, $scope, $reactive, requestViewService, uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.requestViewService = requestViewService;
    this.uiService = uiService;

    this.task = this.requestViewService.getTask();

    this.fromUser    = taskHelper.getUser(this.task.creator);

    console.log("From user = ", this.fromUser.profile.name);

    this.toUser = taskHelper.getUser(this.task.getRequestRecipientUserId() ); // there's always only 1 receipient
  }

  destroy() {
    console.log("destroy--- ");
    this.requestViewService.closeModal();
  }

  accept() {
    console.log("accept... !! ");
  }

  reject() {
    console.log(" reject ");
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
    RequestViewOptions,
    ShowUser
  ]).component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: RequestView
  })
.factory( statusHelper.getServiceName(name), RequestViewService);
