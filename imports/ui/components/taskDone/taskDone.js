import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskDone.html';
import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';
import { updateStatus } from '../../../api/methods/taskMethods.js';

const name = 'taskDone';

class TaskDone {

  constructor($scope, $reactive, $state, uiService) {
    'ngInject';

    this.uiService = uiService;
  }


  action() {
      if ( this.isButton() ) {
        this.uiService.hideModal();
      }

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

  show() {
    if ( statusHelper.allow(this.task, name)  ) {
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
  controller: TaskDone
})

.config(config);

function config($stateProvider) {
'ngInject';

$stateProvider.state('tab.taskDone', {
  url: '/taskDone/:taskId',
  views: {
    'tab-promise': {
        template: '<task-done></task-done>'
    }
  },
  resolve: {
    currentUser($q) {
      if (Meteor.userId() === null) {
        return $q.reject('AUTH_REQUIRED');
      } else {
        return $q.resolve();
      }
    }
  }
});
}