import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './changePassword.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';

const name = 'changePassword';

class ChangePassword {
  constructor($scope, $stateParams,uiService, $reactive) {
    'ngInject';

    this.uiService = uiService;

    this.init();

    $reactive(this).attach($scope);

  }

  init() {
    this.oldpassword='';
    this.credentials = {
      password: '',
    };
    this.password_c='';
  }

  action() {
    Accounts.changePassword(this.oldpassword, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
          this.uiService.spinner(false);
        } else {
          this.error=null;
          this.message ="Your password has been changed";
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
  controller: ChangePassword
})

.config(config);

function config($stateProvider) {
'ngInject';

$stateProvider.state('tab.changepassword', {
  url: '/changepassword',
  views: {
    'tab-notifications': {
      template: '<change-password></change-password>'
    }
  },
});
}
