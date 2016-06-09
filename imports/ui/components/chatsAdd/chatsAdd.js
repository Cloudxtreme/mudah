import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';  // needed for Unit Tests to work
//import ngAvatar from 'angular-avatar';

import { Meteor } from 'meteor/meteor';

import './chatsAdd.html';

import { name as Avatar } from "../avatar/avatar";
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { name as pxModalHeader } from '/imports/ui/directives/pxModalHeader';
import { share } from '/imports/api/methods/taskMethods.js';

const name = 'chatsAdd';

class ChatsAdd {

  constructor($scope, $rootScope, $reactive, $state, uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.uiService = uiService;


    this.helpers({
      users() {
        return Meteor.users.find({ _id: { $ne: Meteor.userId() } });
      }
    });
  }

  newChat(userId) {
    this.uiService.hideModal();
/*
    tmpUser = Meteor.users.findOne(userId);
    console.log("selected user = ", tmpUser.profile.name);
    console.log("new chat for taskId=", this.taskId);
*/
    share.call({
      taskId: this.taskId,
      otherUserId: userId
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  }

  getPhotoUrl(user) {
    if ( user.services.facebook ) {
      return this.uiService.getFacebookPhotoUrl(user);
    }

    if ( user.services.google ) {
      return this.uiService.getGooglePhotoUrl(user);
    }
  }

  getOAuthSource(user) {
    if ( user.services.facebook) {
      return "via Facebook";
    }
    if ( user.services.google) {
      return "via Google";
    }
  }

  handleError(err) {
    this.$log.error('New chat creation error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'New chat creation failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }

}


function chatsAddService($rootScope, $state, uiService) {
  'ngInject';

  var service = {
    openModal: openModal
  }
  return service;

  function openModal(taskId) {
    var modal = "<chats-add task-id='" + taskId + "'></chats-add>";
    uiService.openModal(modal);
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
    taskId: '@'
  },
  controllerAs: name,
  controller: ChatsAdd
})
.factory( statusHelper.getServiceName(name), chatsAddService);
