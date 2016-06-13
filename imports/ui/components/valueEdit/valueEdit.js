import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './valueEdit.html';

import { statusHelper } from '../../helpers/statusHelper';
import moment from 'moment';
import { updateValue } from '../../../api/methods/taskMethods.js';


const name = 'valueEdit';

class  ValueEdit {
  constructor($scope, $reactive, valueEditService) {
    'ngInject';

    this.valueEditService= valueEditService;

    $reactive(this).attach($scope);

    this.currTask = this.valueEditService.getTask();

    console.log("area _id=", this.currTask._id);
  }


  action() {
      this.closeModal(); // easier to mock this!

      this.call('updateValue',
      {
        taskId: this.currTask._id,
        newValue : this.currTask.value
      }, function(err, res) {
        if (err) {
          alert("can't update value");
        } else {
          // success!
        }
      });
  }


  closeModal() {
    this.valueEditService.closeModal();
  }
}


function valueEditService(uiService) {
  'ngInject';
  currTask=null;

  var service = {
    openModal: openModal,
    closeModal: closeModal,
    setTask: setTask,
    getTask : getTask
  }
  return service;


  function openModal(task) {
    setTask(task);
    var modal = "<value-edit></value-edit>";
    uiService.openModal(modal);
  }

  function closeModal() {
    uiService.hideModal();
  }

  function setTask(task) {
    currTask=task;
  }
  function getTask() {
    return currTask;
  }
}


// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<'
  },
  controllerAs: name,
  controller: ValueEdit
})
.factory( statusHelper.getServiceName(name), valueEditService);
