import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskUnrevoke.html';

import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';
import { updateStatus } from '../../../api/methods/taskMethods.js';

const name = 'taskUnrevoke';

class TaskUnrevoke {
  constructor($scope, $reactive,uiService) {
    'ngInject';

    this.uiService = uiService;
    $reactive(this).attach($scope);

    //console.log("TaskUnrevoke task=", this.task);
  }

  action() {
    if ( this.isButton() ) {
      this.uiService.hideModal();
    }

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
    /*
    if ( statusHelper.isSharedTask(this.task) && statusHelper.allow(this.task, name) ) {
        return true;
    }
    */
    todayDate = new Date();
    if ( statusHelper.allow(this.task, name) &&
          (this.task.dueDate==null || this.task.dueDate > todayDate ))  {
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

/*
function TaskUnrevokeService($rootScope, $state) {
  'ngInject';

  var service = {
    doUpdate: doUpdate
  }
  return service;

  // function implementations
  function doUpdate(task) {
    console.log("TaskUnrevokeService  taskId=" + task._id);
  }
}
*/



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
.config(config);
//.factory( statusHelper.getServiceName(name), TaskUnrevokeService);

function config($stateProvider) {
'ngInject';

  $stateProvider.state('tab.taskUnrevoke', {
    url: '/taskUnrevoke/:taskId',
    views: {
      'tab-promise': {
          template: '<task-unrevoke></task-unrevoke>'
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
