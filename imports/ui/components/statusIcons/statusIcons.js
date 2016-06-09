import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './statusIcons.html';

import { statusHelper } from '../../helpers/statusHelper';
import { name as dueDate } from '../dueDate/dueDate';
import { name as AreaEdit } from '../areaEdit/areaEdit';

const name = 'statusIcons';

class StatusIcons {
  constructor($scope, $reactive,  uiService, areaEditService) {
    'ngInject';

    this.uiService = uiService;
    this.statusHelper = statusHelper; // so that it can be used in HTML
    this.areaEditService = areaEditService;

    $reactive(this).attach($scope);

  }

  openArea($event,task) {
    this.uiService.stopFurtherClicks($event);
    this.areaEditService.openModal(task);
  }

  getAreaLabel() {
    if (this.task.area==null) {
      return "Set Area";
    }
    return this.task.area;
  }

  /*
  isEditedByOwner() { // only if the countering has started
    return ( this.task.edited && this.task.creator === this.task.editedBy );
  }
  isEditedByWatcher() {
    return ( this.task.edited && this.task.creator != this.task.editedBy );
  }
  */
  isEdited() {
      return ( this.task.edited  );
  }

  lastEditor() {
      if (this.task.editedBy === Meteor.userId() ) {
        return "me";
      } else {
          return this.getName(this.task.editedBy);
      }
  }

  lastAck() {
    if (this.task.ackBy === Meteor.userId() ) {
      return "me";
    } else {
      return this.getName(this.task.ackBy);
    }
  }

  isOfferStage() {
    if (this.task.status == statusHelper.status.PENDING ) {
      return true;
    }
    return false
  }

  isShared() {
    if ( statusHelper.isCreator(this.task) && statusHelper.isSharedTask(this.task) ) {
      return true;
    }
    return false;
  }

  sharedWith() {
    if ( statusHelper.isSharedTask(this.task) ) {
      return this.getName( this.task.userIds[0] );
    }
    return "";
  }

  isSharedWithMe() {
    if ( statusHelper.isCreator(this.task)==false && _.contains(this.task.userIds, Meteor.userId() ) ) {
      return true;
    }
    return false;
  }

  creatorName() {
      return this.getName( this.task.creator );
  }

  getName(userId) {
    if (userId != null) {
    //  console.log("getName() userId is NOT Null userId=", userId);
      tmpUser = Meteor.users.findOne(userId);
      return tmpUser.profile.name;
    }
    return "";
  }

  hasMessage() {
    if (this.task.lastMessage!=null) {
      return true;
    }
    return false;
  }
  lastMessage() {
    if (this.task.lastMessage!=null) {
        return this.task.lastMessage.text;
    }
    return "";
  }

  lastChatUser() {
    if (this.task.lastMessage!=null) {
        return this.getName(this.task.lastMessage.userId);
    }
    return "";
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  dueDate,
  AreaEdit
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<',
    showArea: '@',
    editArea: '@'
  },
  controllerAs: name,
  controller: StatusIcons
});
