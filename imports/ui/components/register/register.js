import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import './register.html';
import "/imports/ui/components/register/terms.html";
import {name as ValidatePassword } from "/imports/ui/directives/validatePassword";

var tmpModal;

class Register {
  constructor($scope, $state, $reactive, $ionicModal, uiService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$ionicModal = $ionicModal;
    this.uiService = uiService;

    $reactive(this).attach($scope);

    this.init();
  }

  init() {
    this.credentials = {
      email: '',
      password: '',
      profile : { name:''}
    };
    this.agreeTerms=false;

    this.error = '';
    //confirm pwd, credit: http://jsfiddle.net/raving/hybave3y/
    this.password_c = '';
  }

  register() {
    this.uiService.spinner(true);
    Accounts.createUser(this.credentials,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
          this.uiService.spinner(false);
        } else {
          // send verification email
          this.call('verifyUserEmail', {userId: Meteor.userId()});
          Meteor.logout();
          Accounts.logout();
          this.message ="Thank you for registering";
          this.uiService.spinner(false);
        }
      })
    );
  }

  //  ng-disabled="registerForm.$invalid"

  openTerms() {
    this.$ionicModal.fromTemplateUrl('imports/ui/components/register/terms.html', {
        scope: this.$scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        //$scope.modal = modal;
        tmpModal = modal;
        modal.show();
    });
  }

  hideTerms() {
    tmpModal.hide();
  }

}

const name = 'register';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  ValidatePassword
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Register
  })
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider.state('register', {
    url: '/register',
    views: {
      'mainContent': {
        template: '<register></register>'
      }
    }
  });
}
