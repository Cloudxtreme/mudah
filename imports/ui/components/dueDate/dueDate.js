import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-moment';

import './dueDate.html';

import { statusHelper } from '../../helpers/statusHelper';
const name = 'dueDate';

class DueDate {
  constructor($scope) {
    'ngInject';
  }

  show() {
    return (this.date!=null);
  }

  isOverDue() {
    return statusHelper.isOverdueDate(this.date);
  }

}


// create a module
export default angular.module(name, [
  angularMeteor,
  'angularMoment'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    date: '<'
  },
  controllerAs: name,
  controller: DueDate
});
