import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import './avatar.html';
import { name as FacebookPhotoFilter } from '../../filters/facebookPhotoFilter';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { name as EditProfilePhoto } from '../editProfilePhoto/editProfilePhoto';

const name = 'avatar';

class Avatar {

  constructor($scope, $reactive, uiService) {
    'ngInject';

    $reactive(this).attach($scope);
    this.uiService = uiService;

  }

  canEditPhoto() {
    if (this.user==undefined || this.user.services==undefined) return;

    if ( this.user.services.password && this.user._id == Meteor.userId()) {  // can change photo only if you registered with login/password
      return true;
    }
    return false;
  }

  editPhoto() {
    this.uiService.openModal("<edit-profile-photo></edit-profile-photo>");
  }

  getPhotoUrl() {
    return this.uiService.getProfilePhoto(this.user);
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

}

// create a module
export default angular.module(name, [
  angularMeteor
  //EditProfilePhoto
])
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    user: '<'
  },
  controllerAs: name,
  controller: Avatar
})
