import angularMeteor from 'angular-meteor';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { name as Chat } from '/imports/ui/components/chat/chat';
import { name as UserList } from '/imports/ui/components/userList/userList';
import { name as StatusIcons } from '/imports/ui/components/statusIcons/statusIcons';

import './userPromise.html';

name = "userPromise";

export default angular.module(name, [
  angularMeteor,
  Chat,
  UserList,
  StatusIcons
])
.directive('userPromise', userPromiseDirective);

function userPromiseDirective() {
    return {
      restrict: 'E',
      templateUrl: `imports/ui/directives/${name}.html`,
      scope: {},
      bindToController: {
        task: '<'
      },
      controllerAs: name,
      controller: userPromise
    }
}


function userPromise(uiService, chatService) {
  'ngInject';

  userPromise = this;


  let user = taskHelper.getUser(this.task.creator);

  this.photoUrl = uiService.getProfilePhoto(user);
  this.name = user.profile.name

  this.openChat = openChat;

  function openChat($event) {
    uiService.stopFurtherClicks($event);
    chatService.openChat(this.task);
  }

}
