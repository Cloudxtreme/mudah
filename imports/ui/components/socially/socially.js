import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';

import 'angular-animate';
import 'angular-sanitize';
import 'angular-moment';
import 'ionic-scripts';

import  '/imports/ui/3rdparty/ionic-tinder-cards-2/ionic.tdcards2';

import { name as Tabs } from '../tabs/tabs';
import { name as Sidemenu } from '../sidemenu/sidemenu';

import { name as MeteorStatus } from '../meteorStatus/meteorStatus';
import { name as Guest } from '../guest/guest';
import { name as EditProfile } from '../editProfile/editProfile';
import { name as VerifyLoginEmail } from '../verifyLoginEmail/verifyLoginEmail';
import { name as ResetUserPassword } from '../resetUserPassword/resetUserPassword';
import { name as ChangePassword } from '../changePassword/changePassword';
import { name as Integritometer } from '../integritometer/integritometer';
import { name as DraftList } from '../draftList/draftList';
import { name as PromiseList } from '../promiseList/promiseList';
import { name as RequestList } from '../requestList/requestList';
import { name as Notifications } from '../notifications/notifications';
import { name as CompletedList } from '../completedList/completedList';
import { name as KudosList } from '../kudosList/kudosList';
import { name as Photo } from '../photo/photo';

import { Tasks } from '/imports/api/tasks';
import { Messages } from '/imports/api/tasks';

import './socially.html';
const name = 'socially';

class Socially {
  constructor($scope, $reactive) {
    'ngInject';


    $reactive(this).attach($scope);

    this.load();
  }

  load() {
    this.subscribe('users');
  }


}

const dependencies=
[
  angularMeteor,
  uiRouter,
  Guest,
  Tabs,
  Sidemenu,
  Integritometer,
  DraftList,
  PromiseList,
  RequestList,
  Notifications,
  CompletedList,
  KudosList,
  MeteorStatus,
  VerifyLoginEmail,
  ResetUserPassword,
  ChangePassword,
  EditProfile,
  Photo,
  'angularMoment',
//  'accounts.ui',
  'ngAnimate',
  'ionic'
];

if ( Meteor.settings.public.features.allow_tinder_swipe ) {
  console.log("-- enable Tinder --");
  dependencies.push(  'ionicTinder2');
}

export default angular.module(name, dependencies ).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Socially
})
  .config(config)
  .run(run);

// create a module
/*
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Guest,
  Tabs,
  Sidemenu,
  Integritometer,
  DraftList,
  PromiseList,
  RequestList,
  Notifications,
  CompletedList,
  KudosList,
  MeteorStatus,
  VerifyLoginEmail,
  ResetUserPassword,
  ChangePassword,
  EditProfile,
  Photo,
  'angularMoment',
//  'accounts.ui',
  'ngAnimate',
  'ionic',
  'ionicTinder2'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Socially
})
  .config(config)
  .run(run);
*/

function config($locationProvider, $urlRouterProvider) {
  'ngInject';

  console.log("config...");

  $locationProvider.html5Mode(true);  //use html5 mode to make urls look a lot fancier
  $urlRouterProvider.otherwise('/guest');
}

function run($rootScope, $state) {
  'ngInject';


  console.log("run...");
    console.log("------------- attach Mongo collections to global window object [DEV mode ONLY] -------");
    // see: https://forums.meteor.com/t/cannot-use-browser-console-to-view-data-meteor-1-3/21237/2
    window.Tasks = Tasks;
    window.Messages = Messages;
    window.Users = Meteor.users;

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === 'AUTH_REQUIRED') {
        console.log("hmmmm, not logged in.");
        $state.go('guest');
    }
  });
}
