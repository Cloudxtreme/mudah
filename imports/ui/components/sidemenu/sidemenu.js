import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor'
import uiRouter from 'angular-ui-router';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import 'ionic-scripts';


import './sidemenu.html';

import { name as Auth } from '../auth/auth';

class Sidemenu {

  constructor($scope, $reactive) {
    'ngInject';

    this.isSideMenuEnabled = true;
    this.settings = Meteor.settings;

    $reactive(this).attach($scope);


    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }

}

const name = 'sidemenu';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Auth,
  'ionic'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Sidemenu
});
