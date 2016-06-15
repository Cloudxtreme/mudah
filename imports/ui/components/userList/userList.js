import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import './userList.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';

const name = 'userList';

class UserList {

  constructor($scope, uiService) {
    'ngInject';

    this.uiService = uiService;
  }

  getPhotoUrl(userId) {
    let user = taskHelper.getUser(userId);
    return this.uiService.getProfilePhoto(user);
  }

  getName(userId) {
    let user = taskHelper.getUser(userId);
    return user.profile.name;
  }

  onDrag(userId) {
    console.log("----dragging name = ", this.getName(userId));
  }

  onDrop(userId) {
    console.log("----  ----> dropped ! name = ", this.getName(userId));
  }
}


// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    userIds: '<'
  },
  controllerAs: name,
  controller: UserList
});
