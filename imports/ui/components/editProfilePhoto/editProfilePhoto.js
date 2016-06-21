import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor'

import './editProfilePhoto.html';

const name = 'editProfilePhoto';

class EditProfilePhoto {
  constructor($scope, $reactive, uiService, $timeout) {
    'ngInject';

    this.uiService = uiService;
  }

}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: EditProfilePhoto
  })
