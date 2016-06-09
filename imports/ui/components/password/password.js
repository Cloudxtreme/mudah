import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import './password.html';

class Password {
  constructor($scope, $state, $reactive,uiService) {
    'ngInject';

    this.$state = $state;
    this.uiService = uiService;

    // IMPORTANT !! assign services above before calling reactive, else callbacks wont work !
    $reactive(this).attach($scope);


    this.credentials = {
      email: ''
    };

    this.error = null;
    this.message=null;
  }

  reset() {
    this.uiService.spinner(true);
    Accounts.forgotPassword(this.credentials,
      this.$bindToContext((err) => {
        if (err) {
            this.error = err;
            this.uiService.spinner(false);
        } else {
          this.error = null;
          this.uiService.spinner(false);
          this.message = "A reset link has been emailed to you";
        }
      })
    )
  }

}

const name = 'password';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Password
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('password', {
    url: '/password',
    views: {
      'mainContent': {
        template: '<password></password>'
      }
    }
  });
}
