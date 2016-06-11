import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskOffline.html';

import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';

const name = 'taskOffline';

class TaskOffline {
  constructor($scope, $reactive,uiService) {
    'ngInject';
    this.uiService = uiService;
  }


  action() {
      this.uiService.alert("You are offline");
      this.uiService.hideOptions(this.isButton());
  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }

  show() {
    if (statusHelper.isOnline() ) { return false};
    return true;
  }
}

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@'
  },
  controllerAs: name,
  controller: TaskOffline
})
