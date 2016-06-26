import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskSocial.html';

import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';

import { updateStatus } from '../../../api/methods/taskMethods.js';

const name = 'taskSocial';

class TaskSocial {
  constructor($scope, $reactive, $state, $stateParams, uiService) {
    'ngInject';

    this.uiService = uiService;
  }


  action() {
    this.uiService.alert("(Coming Soon) Share on Facebook");
    this.uiService.hideOptions(this.isButton());
  }

  show() {
    if (statusHelper.isOffline() ) { return false};

    if ( this.task.isCreator() && statusHelper.canShareOnSocialMedia(this.task) ) {
      return true;
    }
    return false;
  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
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
  controller: TaskSocial
})
