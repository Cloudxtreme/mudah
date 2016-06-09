import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './promiseListOptions.html';

import { Tasks } from '../../../api/tasks';
import { name as TaskChat } from '../taskChat/taskChat';
import { name as TaskComplete } from '../taskComplete/taskComplete';
import { name as TaskOffer } from '../taskOffer/taskOffer';
import { name as TaskDelete } from '../taskDelete/taskDelete';
import { name as TaskDone } from '../taskDone/taskDone';
import { name as TaskEdit } from '../taskEdit/taskEdit';
import { name as TaskNotDone } from '../taskNotDone/taskNotDone';
import { name as TaskRevoke } from '../taskRevoke/taskRevoke';
import { name as TaskUnrevoke } from '../taskUnrevoke/taskUnrevoke';
import { name as TaskShare } from '../taskShare/taskShare';
import { name as TaskOffline } from '../taskOffline/taskOffline';
import { name as TaskSocial } from '../taskSocial/taskSocial';
import { name as StatusIcons } from '../statusIcons/statusIcons';
import { taskHelper } from '/imports/api/methods/taskHelper';

import { statusHelper } from '../../helpers/statusHelper';

const name = 'promiseListOptions';


class PromiseListOptions {
  constructor($scope, $reactive, taskEditService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.taskEditService=taskEditService;

    if ( this.buttonStyle==null ) {
      console.log("button style not specified, set to option");
      this.buttonStyle="option";
    } else {
      console.log("button style is=", this.buttonStyle);
    }
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskChat,
  TaskComplete,
  TaskOffer,
  TaskDelete,
  TaskDone,
  TaskNotDone,
  TaskEdit,
  TaskRevoke,
  TaskUnrevoke,
  TaskShare,
  TaskSocial,
  TaskOffline
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@'
  },
  controllerAs: name,
  controller: PromiseListOptions
})
