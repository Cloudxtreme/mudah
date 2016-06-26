import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import './userRequest.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { name as Chat } from '/imports/ui/components/chat/chat';

const name = 'userRequest';

class UserRequest {

  constructor($scope, uiService, chatService) {
    'ngInject';

    this.uiService = uiService;
    this.chatService = chatService;


    if ( this.task.isRequestHeader() ) {
      console.log("----is request header");
      const user = taskHelper.getUser(this.task.creator );

      this.photoUrl = uiService.getProfilePhoto(user);
      this.name = user.profile.name;
    } else {
      const user = taskHelper.getUser(this.task.getRequestUserId() ); // there's always only 1 receipient

      this.photoUrl = uiService.getProfilePhoto(user);
      this.name = user.profile.name;
    }

  }

  openChat($event) {
    this.uiService.stopFurtherClicks($event);
    this.chatService.openChat(this.task);
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  Chat
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    color: '@'
  },
  controllerAs: name,
  controller: UserRequest
});
