import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import './guest.html';


class Guest {
  constructor($scope, $state, $reactive, uiService) {
    'ngInject';


    this.$state = $state;
    this.uiService = uiService;

    // IMPORTANT !! assign services above before calling reactive, else callbacks wont work !
    $reactive(this).attach($scope);


    this.helpers({
      isGuest() {
        return (Meteor.userId()==null)
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });

  }

  home() {
    this.uiService.goHomepage();
  }

  loginEmail() {
    this.$state.go('login');
  }

  loginFacebook() {

    Meteor.loginWithFacebook({
      requestPermissions: ["user_about_me", "user_friends", "user_location", "user_posts", "publish_actions"],
      loginStyle: "popup"
    }, this.$bindToContext((err) => {
      if (err) {
        alert("cant login to FB");
      } else {
        this.uiService.goHomepage();
      }
    })
    );

  }

  loginGoogle() {

    Meteor.loginWithGoogle({
  //    requestPermissions: ["user_about_me", "user_friends", "user_location", "user_posts", "publish_actions"],
      loginStyle: "popup"
    }, this.$bindToContext((err) => {
      if (err) {
        alert("cant login to Google");
      } else {
        this.uiService.goHomepage();
      }
    })
    );


  }

  register() {
    this.$state.go('register');
  }

  forgotpwd() {
      this.$state.go('password');
  }


}



const name = 'guest';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Guest
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('guest', {
    url: '/guest',
    views: {
      'mainContent': {
        template: '<guest></guest>'
      }
    },
  });
}
