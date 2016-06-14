import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskUnrevoke.html';

import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';
import { updateStatus } from '../../../api/methods/taskMethods.js';

const name = 'taskUnrevoke';

class TaskUnrevoke {
  constructor($scope, $reactive,uiService, $timeout) {
    'ngInject';

    this.uiService = uiService;
    this.$timeout = $timeout;
    $reactive(this).attach($scope);
  }

  action() {
    this.uiService.hideOptions(this.isButton());

    if ( statusHelper.isSharedTask(this.task) ) {
      // Call the Method
      updateStatus.call({
        taskId: this.task._id,
        newStatus: statusHelper.status.PENDING
      }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          // success!
        }
      });
    } else {
      updateStatus.call({
        taskId: this.task._id,
        newStatus: statusHelper.status.ACTIVE
      }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          // success!
        }
      });
    }

  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }


  show() {

    todayDate = new Date();
    if ( statusHelper.allow( this.task, name) && statusHelper.isNotOverdue(this.task) )  {
      if ( this.task.status==statusHelper.status.CANCELLED ) {
          this.buttonLabel = "Restore";
      } else {
          this.buttonLabel = "Unrevoke";
      }
      return true;
    }

    return false;
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
  controller: TaskUnrevoke
})
