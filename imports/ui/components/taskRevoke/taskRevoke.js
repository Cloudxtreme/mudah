import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskRevoke.html';
import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';

import { updateStatus } from '../../../api/methods/taskMethods.js';

const name = 'taskRevoke';

class TaskRevoke {
  constructor($scope, $reactive, $state, $stateParams, uiService) {
    'ngInject';
    $reactive(this).attach($scope);
    this.uiService = uiService;

  }


  action() {
    if ( this.isButton() ) {
      this.uiService.hideModal();
    }

    newStatus= statusHelper.status.REVOKED;
    if ( this.task.status==statusHelper.status.PENDING ) {
      newStatus= statusHelper.status.CANCELLED;
    }
    // Call the Method
    updateStatus.call({
      taskId: this.task._id,
      newStatus: newStatus
    }, (err, res) => {
      if (err) {
        if (err.error === 'update.not-logged-in') {
            alert('You are not logged in');
        } else {
          // Unexpected error, handle it in the UI somehow
        }
      } else {
        // success!
      }
    });
  }


  show() {
    if (statusHelper.isOffline() ) { return false};

    todayDate = new Date();
    if ( statusHelper.allow(this.task, name) && statusHelper.isNotOverdue(this.task) )  {
      if ( this.getReactively('this.task.status')==statusHelper.status.PENDING ) {
        this.buttonLabel = "Cancel";
      } else {
        this.buttonLabel = "Revoke";
      }

      return true;
    }
    return false;
  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }


}


function TaskRevokeService($rootScope, $state) {
  'ngInject';

  var service = {
    doUpdate: doUpdate
  }
  return service;

  // function implementations
  function doUpdate(task) {
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
  controller: TaskRevoke
})
.factory( statusHelper.getServiceName(name), TaskRevokeService);
