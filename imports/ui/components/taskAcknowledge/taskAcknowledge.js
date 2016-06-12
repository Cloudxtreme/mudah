import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './taskAcknowledge.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { markAsAcknowledged } from '/imports/api/methods/taskMethods';

const name = 'taskAcknowledge';

class TaskAcknowledge {
  constructor($scope,uiService) {
    'ngInject';
    this.uiService = uiService;
  }


  isButton() {
    return statusHelper.isButton(this.buttonStyle);
  }

  show() {

    if (statusHelper.isOffline() ) { return false};

    if ( this.task.statusBy != Meteor.userId() && this.task.ack == false  && statusHelper.needAcknowledgement(this.task) ) {
        return true;
    } else {
      return false;
    }
  }

  action() {
    this.uiService.hideOptions(this.isButton());

    markAsAcknowledged.call({
          taskId: this.task._id
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success!
          }
    });
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
  controller: TaskAcknowledge
})
