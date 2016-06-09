import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import './auth.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { name as Login } from '../login/login';
import { name as Register } from '../register/register';
import { name as Password } from '../password/password';

const name = 'auth';

class Auth {
  constructor($scope, $reactive,uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.uiService = uiService;

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }


  logout() {
    console.log("Logout..");
    Meteor.logout();
    Meteor.logoutOtherClients();
    Accounts.logout();

    this.uiService.goGuestpage();
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter,
  Login,
  Register,
  Password
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Auth
});
