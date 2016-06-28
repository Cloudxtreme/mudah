import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskComplete.html';

import {  statusHelper} from '/imports/ui/helpers/statusHelper';
import {  markAsCompleted} from '/imports/api/methods/taskMethods';
import moment from 'moment';

const name = 'taskComplete';

class TaskComplete {
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

    if ( statusHelper.allow(this.task, name) && this.task.isCompleted()==false  ) {
      if ( this.task.isPrivate() ) {
        return true;
      } else {
        if ( this.task.isCreator()   && this.acknowledgementIsOverdue() ) {
           return true;
         }
      }
    }
    return false;
  }

  acknowledgementIsOverdue() {
    let pastDate = moment().subtract(7, 'd');
    if ( pastDate.isAfter( this.task.statusDate) )  {
      console.log("-- is after 7 days");
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
