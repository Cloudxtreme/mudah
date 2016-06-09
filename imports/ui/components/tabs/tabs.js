import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import 'ionic-scripts';
import { name as uiService } from '/imports/ui/services/uiService';

import './tabs.html';


class Tabs {

  constructor($scope, $reactive, uiService) {
    'ngInject';

    this.uiService = uiService;

    $reactive(this).attach($scope);
  }

  clearHistory() {
      console.log("TabsCtrl  - clear Tab history. Otherwise, when you click a Tab, you get the last View that was displayed there");
      this.uiService.clearHistory();
  }
}

const name = 'tabs';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  'ionic',
  uiService
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Tabs
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider

  .state('tab', {
     url: '/tab',
     abstract: true,
     views:{
       'mainContent': {
         template: '<tabs></tabs>'
       }
     }
   })

}
