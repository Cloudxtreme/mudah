import angular from 'angular';
import angularMeteor from 'angular-meteor';

import {Meteor} from 'meteor/meteor';

import './chatsAdd.html';

import {name as Avatar} from "../avatar/avatar";
import {statusHelper} from '/imports/ui/helpers/statusHelper';
import {name as pxModalHeader} from '/imports/ui/directives/pxModalHeader';
import {shareTask} from '/imports/api/methods/taskMethods.js';
import {requestTask} from '/imports/api/methods/taskMethods.js';
import {clone as _clone } from 'underscore';

const name = 'chatsAdd';

class ChatsAdd {

  constructor($scope, $rootScope, $reactive, $state, uiService, chatsAddService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.uiService = uiService;


    $reactive(this).attach($scope);

    this.task = chatsAddService.getTask();
    this.selected = [];

    this.service = chatsAddService;

    console.log("mode = ", this.mode);
    if ( this.mode=='share') {
      this.buttonLabel="Share";
    } else {
      this.buttonLabel="Request";
    }

    this.helpers({
      users() {
        return Meteor.users.find({
          _id: {
            $ne: Meteor.userId()
          }
        });
      }
    });
  }

  clicked(user) {
    var index = this.selected.indexOf(user);
    if (index > -1) {
      this.selected.splice(index, 1);
      user.selected = false;
    } else {
      this.selected.push(user);
      user.selected = true;
    }

    console.log("selected count=", this.selected.length);

    this.displayUsers = _clone(this.selected);
    this.displayUsers.reverse();

  }

  remove(user) {
    var index = this.selected.indexOf(user);
    if (index > -1) {
      this.selected.splice(index, 1);
      user.selected = false;
    }
  }

  action() {
    this.uiService.hideModal();

    //console.log("number of users=", this.selected.length);
    //console.log(this.selected);

    let userIds = [];
    for (x=0;x<this.selected.length;x++) {
      let user = this.selected[x];
      console.log("name = ", user.profile.name);
      userIds[x] = user._id;
    }

    if  (this.mode=='share') {
      this.doShare(this.task._id, userIds);
    } else {
      this.doRequest(this.task._id, userIds);
    }
  }

  doShare(taskId, userIds) {
    console.log("----doShare()----");
    shareTask.call({
      taskId: taskId,
      otherUserId: userIds
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  }

  doRequest(taskId, userIds) {
    console.log("-----doRequest()----");
    requestTask.call({
      taskId: taskId,
      userIds: userIds
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  }

  getPhotoUrl(user) {
    return this.uiService.getProfilePhoto(user);
  }

  destroy() {
    console.log("destroy--- ");
    this.service.closeModal();
  }

}


function chatsAddService($rootScope, $state, uiService) {
  'ngInject';
  let currTask=null;

  var service = {
    openShare: openShare,
    openRequest: openRequest,
    setTask: setTask,
    getTask : getTask,
    closeModal : closeModal
  }
  return service;

  function open(modal,task) {
    setTask(task);
    uiService.openModal(modal);
  }

  function openShare(task) {
    var modal = "<chats-add mode='share'></chats-add>";
    console.log(modal);
    open(modal,task);
  }

  function openRequest(task) {
    var modal = "<chats-add mode='request'></chats-add>";
    console.log(modal);
    open(modal,task);
  }

  function setTask(task) {
    currTask = task;
  }

  function getTask() {
    return currTask;
  }

  function closeModal() {
    uiService.hideModal();
  }
}


// create a module
export default angular.module(name, [
    angularMeteor,
    pxModalHeader,
    Avatar
  ])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    bindings: {
      mode: '@'
    },
    controllerAs: name,
    controller: ChatsAdd
  })
  .factory(statusHelper.getServiceName(name), chatsAddService);
