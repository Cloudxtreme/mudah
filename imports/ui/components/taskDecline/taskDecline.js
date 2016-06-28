import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskDecline.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';

const name = 'taskDecline';

class TaskDecline {
  constructor($scope,$reactive, uiService) {
    'ngInject';
    this.uiService = uiService;
    $reactive(this).attach($scope);
  }


  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }


  show() {
    if (statusHelper.isOffline() ) { return false};

    if ( this.task.status == statusHelper.status.PENDING && statusHelper.isMyTurnToRespond(this.task) ) {
        return true;
    }
    return false;
  }


  action() {
    this.uiService.hideOptions(this.isButton());

    // Call the Method
    this.call('declineTask', {taskId: this.task._id} );
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
  controller: TaskDecline
})
