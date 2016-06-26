import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-moment';


import './dueDate.html';

import { statusHelper } from '../../helpers/statusHelper';
const name = 'dueDate';

class DueDate {
  constructor($scope) {
    'ngInject';

    this.color = 'positive';
    this.beforeColor  = 'positive';  // class name
    this.afterColor = 'assertive';
  }

  show() {
     if ( this.date != null ) {
      this.isOverDue = statusHelper.isOverdueDate(this.date);
      if ( this.isOverDue ) {
        this.dueDateColor = this.afterColor;
      } else {
        this.dueDateColor = this.beforeColor;
      }
    }
    return (this.date!=null);
  }

}


// create a module
export default angular.module(name, [
  angularMeteor,
  'angularMoment'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    date: '<',
    color:'@',
    beforeColor: '@',
    afterColor: '@'
  },
  controllerAs: name,
  controller: DueDate
});
