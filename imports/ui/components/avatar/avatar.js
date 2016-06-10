import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import './avatar.html';
import { name as FacebookPhotoFilter } from '../../filters/facebookPhotoFilter';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

const name = 'avatar';

class Avatar {

  constructor($scope, $reactive, uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.uiService = uiService;
  }

  canEditPhoto() {
    if (this.user==undefined || this.user.services==undefined) return;

    if ( this.user.services.password ) {  // can change photo only if you registered with login/password
      return true;
    }
    return false;
  }

  editPhoto() {
    this.uiService.goState("tab.photo");
  }

  getPhotoUrl() {
    if (this.user==undefined || this.user.services==undefined) return;

    if ( this.user.services.facebook ) {
      return this.uiService.getFacebookPhotoUrl(this.user);
    }

    if ( this.user.services.google ) {
      return this.uiService.getGooglePhotoUrl(this.user);
    }

    if ( this.user.services.password && this.user.profile.photo ) {
        return this.user.profile.photo;
    }

    return "/img/blankuser.png";
  }

  getOAuthSource() {
    if (this.user==undefined || this.user.services==undefined) return;

    if ( this.user.services.facebook) {
      return "Logged in via Facebook";
    }
    if ( this.user.services.google) {
      return "Logged in via Google";
    }
  }

  editPhoto() {
    this.uiService.goState("tab.photo");
  }

}

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    user: '<'
  },
  controllerAs: name,
  controller: Avatar
})
