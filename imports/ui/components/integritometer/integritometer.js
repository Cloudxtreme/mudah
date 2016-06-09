import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-chart.js';

import './integritometer.html';

import { Tasks } from '../../../api/tasks';
import { statusHelper } from '../../helpers/statusHelper';

const name = 'integritometer';

class Integritometer {
  constructor($scope, $reactive, $state, $stateParams, uiService) {
    'ngInject';

    this.labels =["Career", "Health", "Finance", "Family", "Friends", "Leisure", "Love", "Misc"];
    this.data = [
     [65, 73, 50, 65, 56, 55, 70],
     [28, 58, 35, 40, 20, 34, 60]
    ];

    this.uiService = uiService;
  }

  search(months) {
   console.log("months = ",months);
   switch(months) {
     case 1:
       this.data = [
        [15, 13, 10, 11, 16, 15, 10],
        [8, 5, 5, 6, 7, 9, 4]
       ];
        break;
     case 3:
       this.data = [
        [25, 33, 20, 25, 16, 25, 20],
        [18, 18, 15, 10, 10, 14, 10]
       ];
        break;
     case 6:
       this.data =  [
        [35, 43, 40, 35, 46, 50, 40],
        [28, 36, 35, 30, 30, 34, 30]
       ];
        break;
     default:
       this.data = [
        [65, 73, 50, 65, 56, 55, 70],
        [28, 58, 35, 40, 20, 34, 60]
       ];
   }
  }

}


// create a module
export default angular.module(name, [
  angularMeteor,
  'chart.js'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    type: '@'
  },
  controllerAs: name,
  controller: Integritometer
})
.config(config);

function config($stateProvider) {
'ngInject';

$stateProvider.state('tab.integritometer', {
  url: '/integritometer',
  views: {
    'tab-integritometer': {
        template: '<integritometer></integritometer>'
    }
  },
  resolve: {
    currentUser($q) {
      if (Meteor.userId() === null) {
        return $q.reject('AUTH_REQUIRED');
      } else {
        return $q.resolve();
      }
    }
  }
});
}
