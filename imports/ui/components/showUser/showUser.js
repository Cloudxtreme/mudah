import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import './showUser.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';

const name = 'showUser';

class ShowUser {

  constructor($scope, uiService) {
    'ngInject';

    this.photoUrl = uiService.getProfilePhoto(this.user);
    this.name = this.user.profile.name;

    console.log(this.photoUrl);
    console.log(this.name);
  }
}


// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    user: '<',
    color: '@'
  },
  controllerAs: name,
  controller: ShowUser
});
