import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskComplete.html';

import {
  statusHelper
} from '/imports/ui/helpers/statusHelper';
import {
  markAsCompleted
} from '/imports/api/methods/taskMethods';

const name = 'taskComplete';

class TaskComplete {
  constructor($scope, $reactive, uiService) {
    'ngInject';

    this.uiService = uiService;
    $reactive(this).attach($scope);
  }


  action() {
    this.uiService.hideOptions(this.isButton());

    markAsCompleted.call({
      taskId: this.task._id
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  }
  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }

  show() {
    if (statusHelper.isOffline()) {
      return false
    };

    if (this.task.completed == false && statusHelper.allow(this.task, name)) {
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
  controller: TaskComplete
});
