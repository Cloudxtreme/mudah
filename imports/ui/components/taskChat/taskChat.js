import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskChat.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { name as Chat } from '../chat/chat';

const name = 'taskChat';

class TaskChat {
  constructor($scope, $state, uiService) {
    'ngInject';
    this.$state = $state;
    this.uiService = uiService;
  }

  isButton() {
    //console.log("task chat button=", this.buttonStyle);
    //console.log("isButton=", statusHelper.isButton(this.buttonStyle) );

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
    this.uiService.hideOptions(this.isButton());
    
    this.$state.go("tab.chat", { chatId: this.task._id });
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
