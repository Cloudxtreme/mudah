import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskDelete.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { deleteTask } from '/imports/api/methods/taskMethods';
import { name as TaskEdit } from '../taskEdit/taskEdit';
const name = 'taskDelete';

class TaskDelete {
  constructor($scope, $rootScope, uiService, taskEditService ) {
    'ngInject';
    this.uiService = uiService;
    this.taskEditService = taskEditService;
    this.$rootScope = $rootScope;
  }

  action() {

    if ( this.$rootScope.modal ) {
      this.$rootScope.modal.hide();
      this.$rootScope.modal.remove();
    }
    if ( this.$rootScope.editModal ) {
      this.$rootScope.editModal.hide();
      this.$rootScope.editModal.remove();
    }

    deleteTask.call({
      taskId: this.task._id
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  }

  show() {
    if (statusHelper.isOffline() ) { return false};

    if ( statusHelper.allow(this.task, name) || statusHelper.isCompleted(this.task) ) {
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
  angularMeteor,
  TaskEdit
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@',
    close: '@'
  },
  controllerAs: name,
  controller: TaskDelete
})
