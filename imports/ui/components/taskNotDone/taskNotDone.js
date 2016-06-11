import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskNotDone.html';
import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';
import { updateStatus } from '../../../api/methods/taskMethods.js';

const name = 'taskNotDone';

class TaskNotDone {

  constructor($scope, $reactive, $state, uiService) {
    'ngInject';


    this.uiService = uiService;
  }


  action() {
    this.uiService.hideOptions(this.isButton());

    console.log("not-done task ...", this.task._id);
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
    todayDate = new Date();
    if ( statusHelper.allow(this.task, name) && statusHelper.isOverdue(this.task) ) {
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
  controller: TaskNotDone
})
.config(config);

function config($stateProvider) {
'ngInject';

$stateProvider.state('tab.taskNotDone', {
  url: '/taskNotDone/:taskId',
  views: {
    'tab-promise': {
        template: '<task-not-done></task-not-done>'
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
