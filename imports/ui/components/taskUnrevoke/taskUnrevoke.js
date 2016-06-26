import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskUnrevoke.html';

import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';

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
    this.call('unrevokeTask', {taskId:this.task._id});
  }

  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }


  show() {

    todayDate = new Date();
    if ( this.task.isCreator() && statusHelper.allow( this.task, name) && statusHelper.isNotOverdue(this.task) )  {
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
