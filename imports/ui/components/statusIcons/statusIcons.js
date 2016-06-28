import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { statusHelper } from '../../helpers/statusHelper';
import { name as dueDate } from '../dueDate/dueDate';
import { name as EditArea } from '../editArea/editArea';
import { name as EditValue } from '../editValue/editValue';
import 'angular-moment';


const name = 'statusIcons';
import "./statusIcons.html";
import "./dev_statusIcons.html";

class StatusIcons {
  constructor($scope, $reactive,  uiService, editAreaService, editValueService) {
    'ngInject';

    this.uiService = uiService;
    this.statusHelper = statusHelper; // so that it can be used in HTML
    this.editAreaService = editAreaService;
    this.editValueService = editValueService;

    $reactive(this).attach($scope);

  }

  openArea($event,task) {
    this.uiService.stopFurtherClicks($event);
    this.editAreaService.openModal(task);
  }

  openValue($event,task) {
    this.uiService.stopFurtherClicks($event);
    this.editValueService.openModal(task);
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

  hasCounterOffer() {
    if (this.isOfferStage() && this.task.hasOneParticipant() && statusHelper.isMyTurnToRespond(this.task) && this.task.isCountered() ) {
      return true;
    }
    return false;
  }
  lastEditor() {
      if (this.task.editedBy === Meteor.userId() ) {
        this.myTurn = false;
        return "me";
      } else {
        this.myTurn=true;
        return statusHelper.getName(this.task.editedBy);
      }
  }

  lastAck() {
    if (this.task.ackBy === Meteor.userId() ) {
      return "me";
    } else {
      return statusHelper.getName(this.task.ackBy);
    }
  }

  isOfferStage() {
    if (this.task.status == statusHelper.status.PENDING ) {
      return true;
    }
    return false
  }



  canEditArea() {
    if (  this.task.isCreator() ) {
      return true;
    }
    return false;
  }

  canEditValue() {
    if ( this.task.hasOneParticipant() ) {
        if (  this.task.isParticipant()  ) {
          return true;
        }
    } else {
      // private or group share
      if (  this.task.isCreator()  ) {
          return true;
      }
    }

    return false;
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
        return statusHelper.getName(this.task.lastMessage.userId);
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
  EditArea,
  EditValue
]).component(name, {
  templateUrl: function() {
    if ( Meteor.settings.public.features.dev_statusicons ) {
      return `imports/ui/components/${name}/dev_${name}.html`;
    } else {
      return `imports/ui/components/${name}/${name}.html`;
    }
  },
  bindings: {
    task: '<'
  },
  controllerAs: name,
  controller: StatusIcons
});
