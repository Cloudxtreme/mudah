import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import './login.html';


class Login {
  constructor($scope, $state, $reactive, uiService) {
    'ngInject';

    console.log("Login component");

    this.$state = $state;
    this.uiService = uiService;

    // IMPORTANT !! assign services above before calling reactive, else callbacks wont work !
    $reactive(this).attach($scope);

    this.credentials = {
      email: '',
      password: ''
    };

    this.error = '';

  }

  login() {
    console.log("login.....");

    this.uiService.spinner(true);
    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
          this.uiService.spinner(false);
        } else {
          console.log("login.....You're in !!!");
          this.uiService.spinner(false);
          this.uiService.goHomepage();
        }
      })
    );
  }

}



const name = 'login';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Login
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    views: {
      'mainContent': {
        template: '<login></login>'
      }
    },
  });
}
