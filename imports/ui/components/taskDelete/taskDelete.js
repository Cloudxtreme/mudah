import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskDelete.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { deleteTask } from '/imports/api/methods/taskMethods';
const name = 'taskDelete';

class TaskDelete {
  constructor($scope, uiService) {
    'ngInject';
    this.uiService = uiService;
  }

  action() {
    if ( this.isButton() ) {
      this.uiService.hideModal();
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
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@'
  },
  controllerAs: name,
  controller: TaskDelete
})
