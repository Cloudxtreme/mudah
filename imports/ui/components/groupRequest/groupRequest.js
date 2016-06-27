import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import './groupRequest.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';

const name = 'groupRequest';

class GroupRequest {

  constructor($scope, uiService) {
    'ngInject';

    this.uiService = uiService;

    const user = taskHelper.getUser(this.task.creator);
    this.photoUrl = uiService.getProfilePhoto(user);
    this.name = user.profile.name;
  }

  sharedWith() {
    
    if ( statusHelper.isSharedTask(this.task) ) {
      let firstUser = this.getName( this.task.userIds[0] );
      let howManyOthers = this.task.userIds.length;

      if ( howManyOthers==0) {
          console.log("this is a Bug ! should not be a shared task and shared with 0 users !!");
          return "";
      }

      if ( howManyOthers==1) {
        return firstUser;
      } else {
        if ( howManyOthers==2) {
          return firstUser + " and 1 other";
        } else {
          return firstUser + " and " + howManyOthers + " others";
        }
      }
    }
    return "";
  }

  getName(userId) {
    if (userId != null) {
    //  console.log("getName() userId is NOT Null userId=", userId);
      tmpUser = Meteor.users.findOne(userId);
      return tmpUser.profile.name;
    }
    return "";
  }

}


// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    color: '@'
  },
  controllerAs: name,
  controller: GroupRequest
});
