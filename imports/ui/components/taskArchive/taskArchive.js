import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskArchive.html';

import {  statusHelper} from '/imports/ui/helpers/statusHelper';
import {  markAsArchived} from '/imports/api/methods/taskMethods';

const name = 'taskArchive';

class TaskArchive {
  constructor($scope, $rootScope, $reactive, uiService) {
    'ngInject';

    this.uiService = uiService;
    this.$rootScope = $rootScope;

    $reactive(this).attach($scope);
  }


  action() {

    if ( this.$rootScope.modal ) {
      this.$rootScope.modal.hide();
      this.$rootScope.modal.remove();
    }

    this.call('markAsArchived', {taskId:this.task._id},
      function(err, res)  {
        if (err) {
          alert(err);
        } else {
          // success!
          this.task.archived = true; // to hide button
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

    if ( this.task.isCompleted() && this.task.isCreator() && this.task.isArchived()==false ) {
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
  controller: TaskArchive
});
