import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './watchListOptions.html';
import { name as TaskAccept } from '../taskAccept/taskAccept';
import { name as TaskDecline } from '../taskDecline/taskDecline';
import { name as TaskChat } from '../taskChat/taskChat';
import { name as TaskOffer } from '../taskOffer/taskOffer';
import { name as TaskAcknowledge } from '../taskAcknowledge/taskAcknowledge';
import { taskHelper } from '/imports/api/methods/taskHelper';

import { statusHelper } from '/imports/ui/helpers/statusHelper';

const name = 'watchListOptions';

class WatchListOptions {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    if ( this.buttonStyle==null ) {
      //console.log("button style not specified, set to option");
      this.buttonStyle="option";
    } 
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskAccept,
  TaskDecline,
  TaskAcknowledge,
  TaskChat,
  TaskOffer
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    buttonStyle: '@'
  },
  controllerAs: name,
  controller: WatchListOptions
})
