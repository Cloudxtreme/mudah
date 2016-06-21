import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskDecline.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { updateStatus } from '/imports/api/methods/taskMethods';

const name = 'taskDecline';

class TaskDecline {
  constructor($scope,uiService) {
    'ngInject';
    this.uiService = uiService;
  }


  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }


  show() {
    if (statusHelper.isOffline() ) { return false};

    if ( this.task.status == statusHelper.status.PENDING && this.task.isShared() && statusHelper.isMyTurnToRespond(this.task) ) {
        return true;
    }
    return false;
  }


  action() {
    this.uiService.hideOptions(this.isButton());

    newStatus = statusHelper.getNextStatus(name,  this.task.status);

    // Call the Method
    updateStatus.call({
      taskId: this.task._id,
      newStatus: newStatus
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
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
