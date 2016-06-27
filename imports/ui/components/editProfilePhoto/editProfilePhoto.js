import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor'
import { name as Photo } from '../photo/photo';

import './editProfilePhoto.html';

const name = 'editProfilePhoto';

class EditProfilePhoto {
  constructor($scope, $reactive, uiService, $timeout) {
    'ngInject';

    this.uiService = uiService;

    console.log("--- edit profile photo ---");
  }

}


// create a module
export default angular.module(name, [
  angularMeteor,
  Photo
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: EditProfilePhoto
  })
