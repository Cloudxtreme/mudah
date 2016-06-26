import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskRevoke.html';
import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';

import { revokeTask } from '/imports/api/methods/taskMethods.js';

const name = 'taskRevoke';

class TaskRevoke {
  constructor($scope, $reactive, $state, $stateParams, uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.uiService = uiService;
  }


  action() {
    this.uiService.hideOptions(this.isButton());

    // Call the Method
    revokeTask.call({
      taskId: this.task._id
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

    if ( this.task.isCreator() && statusHelper.allow(this.task, name) && statusHelper.isNotOverdue(this.task) )  {
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
