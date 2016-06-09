import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import './resetUserPassword.html';
import {name as ValidatePassword } from "/imports/ui/directives/validatePassword";

const name = 'resetUserPassword';

class ResetUserPassword {
  constructor($scope, $stateParams, $reactive, uiService) {
    'ngInject';

    this.token = $stateParams.token;
    this.uiService = uiService;

    $reactive(this).attach($scope);
    console.log("---> ResetUserPassword Called token=", this.token);

    this.credentials = {
      password: '',
    };

    this.error = '';
    this.password_c = '';
  }

  action() {
    console.log("reset password token=", this.token);
    console.log("new password=", this.credentials.password);
    this.uiService.spinner(true);

    Accounts.resetPassword(this.token, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
          this.uiService.spinner(false);
        } else {
          // send verification email
          Meteor.logout();
          Accounts.logout();
          this.message ="Your password has been changed";
          this.uiService.spinner(false);
        }
      })
    );

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
    controller: ResetUserPassword
  })
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider.state('resetuserpassword', {
    url: '/resetuserpassword/:token',
    views: {
      'mainContent': {
        template: '<reset-user-password></reset-user-password>'
      }
    }
  });
}
