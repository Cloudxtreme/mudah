import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskComplete.html';

import {  statusHelper} from '/imports/ui/helpers/statusHelper';
import {  markAsCompleted} from '/imports/api/methods/taskMethods';

const name = 'taskComplete';

class TaskComplete {
  constructor($scope, $rootScope, $reactive, uiService) {
    'ngInject';

    this.uiService = uiService;
    this.$rootScope = $rootScope;

    $reactive(this).attach($scope);
  }


  action() {
  
    this.call('markAsCompleted', {taskId:this.task._id},
      function(err, res)  {
        if (err) {
          alert(err);
        } else {
          // success!
          this.task.completed = true; // to hide button
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
