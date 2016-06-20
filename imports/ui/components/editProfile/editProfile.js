import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor'

import './editProfile.html';

const name = 'editProfile';

class EditProfile {
  constructor($scope, $reactive, uiService, $timeout) {
    'ngInject';

    this.uiService = uiService;

    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });

    this.error='';
    this.message='';
    this.userName='';

  }


  action() {
    this.uiService.spinner(true);

    this.call('updateProfileName',{name:this.userName},
     function(err)  {
        if (err) {
          this.error = err;
          this.uiService.spinner(false);
        } else {
          this.message ="name changed";
          this.error=null;
          this.uiService.spinner(false);
        }
      });
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
    controller: EditProfile
  })
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider.state('tab.editprofile', {
    url: '/editprofile',
    views: {
      'tab-notice': {
        template: '<edit-profile></edit-profile>'
      }
    },
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}
