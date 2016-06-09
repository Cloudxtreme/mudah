import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './verifyLoginEmail.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';

const name = 'verifyLoginEmail';

class VerifyLoginEmail {
  constructor($scope, $stateParams,uiService, $reactive) {
    'ngInject';

    this.token = $stateParams.token;
    this.uiService = uiService;

    $reactive(this).attach($scope);

    this.action();
  }

  action() {
    Accounts.verifyEmail(this.token,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
          this.uiService.spinner(false);
        } else {
          // send verification email
          this.username = Meteor.user().profile.name;
          Meteor.logout();
          Accounts.logout();
          this.message ="Your account has been activated";
          this.uiService.spinner(false);
        }
      })
    );

  }


}


// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: VerifyLoginEmail
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('verifyloginemail', {
    url: '/verifyloginemail/:token',
    views: {
      'mainContent': {
        template: '<verify-login-email></verify-login-email>'
      }
    },
  });
}
