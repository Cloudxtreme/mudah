import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './editArea.html';

import { statusHelper } from '../../helpers/statusHelper';
import moment from 'moment';
import { updateDueDate } from '../../../api/methods/taskMethods.js';


const name = 'editArea';

class EditArea {
  constructor($scope, $reactive, editAreaService) {
    'ngInject';

    this.editAreaService= editAreaService;

    $reactive(this).attach($scope);

    this.currTask = this.editAreaService.getTask();

    console.log("area _id=", this.currTask._id);
  }


  action() {
      this.closeModal(); // easier to mock this!

      this.call('updateArea',
      {
        taskId: this.currTask._id,
        newArea : this.currTask.area
      }, function(err, res) {
        if (err) {
          alert("can't update area");
        } else {
          // success!
        }
      });
  }


  closeModal() {
    this.editAreaService.closeModal();
  }
}


function editAreaService(uiService) {
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
    var modal = "<edit-area></edit-area>";
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
  controller: EditArea
})
.factory( statusHelper.getServiceName(name), editAreaService);
