import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { statusHelper } from '../../helpers/statusHelper';
import { name as dueDate } from '../dueDate/dueDate';
import { name as AreaEdit } from '../areaEdit/areaEdit';
import { name as ValueEdit } from '../valueEdit/valueEdit';
import 'angular-moment';


const name = 'statusIcons';
import "./statusIcons.html";

class StatusIcons {
  constructor($scope, $reactive,  uiService, areaEditService, valueEditService) {
    'ngInject';

    this.uiService = uiService;
    this.statusHelper = statusHelper; // so that it can be used in HTML
    this.areaEditService = areaEditService;
    this.valueEditService = valueEditService;

    $reactive(this).attach($scope);

  }

  openArea($event,task) {
    this.uiService.stopFurtherClicks($event);
    this.areaEditService.openModal(task);
  }

  openValue($event,task) {
    this.uiService.stopFurtherClicks($event);
    this.valueEditService.openModal(task);
  }

  showChat() {
    return Meteor.settings.public.features.chat;
  }

  getAreaLabel() {
    if (this.task.area==null) {
      return "Set Area";
    }
    return this.task.area;
  }

  getValueLabel() {
    if (this.task.value==null) {
      return "Set Value";
    }
    return "Value " + this.task.value;
  }

  isEdited() {
      return ( this.task.edited  );
  }

  lastEditor() {
      if (this.task.editedBy === Meteor.userId() ) {
        this.myTurn = false;
        return "me";
      } else {
        this.myTurn=true;
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

  isSharedWithMe() {
    if ( statusHelper.isCreator(this.task)==false &&  statusHelper.isParticipant(this.task) )  {
      return true;
    }
    return false;
  }

  canEditArea() {
    if (  statusHelper.isCreator(this.task) ) {
      return true;
    }
    return false;
  }

  canEditValue() {
    if (  statusHelper.isCreator(this.task) ) {
      return false;
    }
    return true;
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

  isRecentMessage() {
    let lastHour = new Date()
    lastHour.setHours( lastHour.getHours() - 1);

    if ( this.task.lastMessage.timestamp > lastHour ) {
      //console.log("  msg = ", this.task.lastMessage.timestamp);
      //console.log("1 ago = ", lastHour);
      return true;
    }
    return false;
  }

  isShowRewardsForfeit() {
    return Meteor.settings.public.features.reward_forfeit;
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  'angularMoment',
  dueDate,
  AreaEdit,
  ValueEdit
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    task: '<'
  },
  controllerAs: name,
  controller: StatusIcons
});
