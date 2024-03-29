import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './statusOption.html';

import { statusHelper } from '../../helpers/statusHelper';
import { name as uiService } from '../../services/uiService';


const name = 'statusOption';

class StatusOption {
  constructor($scope, $reactive,$injector, uiService) {
    'ngInject';
    this.$injector = $injector;
    this.uiService = uiService;

  }

  action() {
    console.log("statusOption action=", this.component);
    console.log("task=");
    console.log(this.task);

    if (this.task) {
      compService = this.getComponentService(this.component);


      this.redirect(this.component, this.task);
    }
  }


  show() {
      if (this.task && statusHelper.allow(this.task, this.component) ) {
          return true;
      }
      return false;
  }

  getComponentService(component) {
    serviceName = statusHelper.getServiceName(component);
    if  ( this.$injector.has(serviceName)) {
      console.log("Component has its own service, call : " + component);
      serv = this.$injector.get(serviceName);

      return serv;
    }
    return null;
  }


}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiService
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    component: '@',
    class: '@',
    title: '@'
  },
  controllerAs: name,
  controller: StatusOption
});
