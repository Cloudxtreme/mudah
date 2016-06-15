import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router'; // needed for Unit Tests to work

import {Meteor} from 'meteor/meteor';

import './chatsAdd.html';

import {name as Avatar} from "../avatar/avatar";
import {statusHelper} from '/imports/ui/helpers/statusHelper';
import {name as pxModalHeader} from '/imports/ui/directives/pxModalHeader';
import {shareMany} from '/imports/api/methods/taskMethods.js';

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

    console.log("mode = ", this.mode);

    this.autorun(() => {
      let x = this.getReactively('this.selected');
      console.log('Autorun!! selected count=', x.length );

    });

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
  }

  getPhotoUrl() {
    return this.uiService.getProfilePhoto(user);
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
    shareMany.call({
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
  }

  getPhotoUrl(user) {
    return this.uiService.getProfilePhoto(user);
  }


}


function chatsAddService($rootScope, $state, uiService) {
  'ngInject';
  let currTask=null;

  var service = {
    openShare: openShare,
    setTask: setTask,
    getTask : getTask
  }
  return service;


  function openShare(task) {
    setTask(task);
    var modal = "<chats-add mode='share'></chats-add>";
    console.log(modal);
    uiService.openModal(modal);
  }

  function setTask(task) {
    currTask = task;
  }

  function getTask() {
    return currTask;
  }
}


// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    pxModalHeader,
    Avatar,
    //'ngAvatar'
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
