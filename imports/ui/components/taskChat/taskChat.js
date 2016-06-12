import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskChat.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { name as Chat } from '../chat/chat';

const name = 'taskChat';

class TaskChat {
  constructor($scope, $state, uiService, chatService) {
    'ngInject';
    this.$state = $state;
    this.uiService = uiService;
    this.chatService = chatService;
  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }

  show() {

    if (statusHelper.isOffline() ) { return false};

    if (  statusHelper.isSharedTask(this.task) ) {
        return true;
    }
    return false;
  }

  action() {
    this.uiService.hideOptions(this.isButton(), true);

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
    buttonStyle: '@'
  },
  controllerAs: name,
  controller: TaskChat
})
