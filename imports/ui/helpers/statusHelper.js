// how to use :
//  import { statusHelper } from '../../helpers/statusHelper';
// no need to specify as Angular [] dependency... as not a module !!
/*
db.inventory.find( {
    $and : [
        { $or : [ { price : 0.99 }, { price : 1.99 } ] },
        { $or : [ { sale : true }, { qty : { $lt : 20 } } ] }
    ]
} )
*/
import _ from 'underscore';

class StatusHelper {
  constructor() {

    this.status = {
       DRAFT    : 'DRAFT',      // newly created, not shared
       PENDING   : 'PENDING',
       CANCELLED : 'CANCELLED',
       ACTIVE   : 'ACTIVE',     // enshrined
       DECLINED : 'DECLINED',
       REVOKED  : 'REVOKED',    // cancelled
       DONE     : 'DONE',       // task has been 'done'
       NOTDONE  : 'NOTDONE'    // task was 'not done'
    }

    this.flag = {
      OVERDUE : 'OVERDUE'
    }

    this.acceptedStatus =  {};
    this.acceptedStatus['taskAccept'] = [this.status.DRAFT, this.status.PENDING];
    this.acceptedStatus['taskDecline'] = [this.status.PENDING];


    this.acceptedStatus['taskOffer'] = [this.status.PENDING];
    this.acceptedStatus['taskComplete'] = [this.status.DONE,this.status.NOTDONE,this.status.REVOKED];
    this.acceptedStatus['taskDelete'] = [this.status.DRAFT, this.status.CANCELLED, this.status.DECLINED];
    this.acceptedStatus['taskDone'] = [this.status.ACTIVE];
    this.acceptedStatus['taskEdit'] = [this.status.DRAFT, this.status.PENDING];
    this.acceptedStatus['taskNotDone'] = [this.status.ACTIVE];
    this.acceptedStatus['taskRevoke'] = [this.status.ACTIVE, this.status.PENDING];
    this.acceptedStatus['taskUnrevoke'] = [this.status.REVOKED, this.status.CANCELLED];

    this.acceptedStatus['taskShare'] = [this.status.DRAFT];

    this.acceptedStatus['taskAcknowledge'] = [this.status.DECLINED, this.status.DONE,this.status.NOTDONE,
                                              this.status.REVOKED, this.status.CANCELLED];
    this.acceptedStatus['taskSocial'] = [this.status.ACTIVE, this.status.DONE, this.status.NOTDONE, this.status.REVOKED];

    this.nextStatus =  {};
    this.nextStatus['taskAccept'] = this.status.ACTIVE;
    this.nextStatus['taskDecline'] = this.status.DECLINED;
    this.nextStatus['taskSelfAccept'] = this.status.ACTIVE;

    this.nextStatus['taskDone'] = this.status.DONE;
    this.nextStatus['taskNotDone'] = this.status.NOTDONE;

    this.nextStatus['taskShare'] = this.status.PENDING;

    // these tasks have full-screen Views you need to call to capture more details
    this.nextState = ['taskChat', 'taskOffer', 'taskDone', 'taskDelete', 'taskShare'];
  }

  getNextStatus(component, currStatus) {
    if ( this.nextStatus[component] == undefined ) {
        console.log("Not available, no next status for : " + component);
        return currStatus;
    }
    return this.nextStatus[component];;
  }

  getNextState(component) {
    console.log("getNextState comp=" + component);

    if ( this.nextState.indexOf(component) >= 0 ) {
        nextState = "tab." + component; //something like tab.taskChat as defined in  $stateProvider
        console.log("getNextState() component=" + component + " nextState=" + nextState);
        return nextState;
    }
    return null;
  }

  allow(task, component) {

      acceptedStatus = this.acceptedStatus[component];
      if (acceptedStatus==undefined) {
        console.log("component not defined, ", component);
        return false;
      }

      if ( acceptedStatus.indexOf(task.status) >= 0  ) {
          return true;
      }

      return false;
  }

  getServiceName(component) {
    return component + 'Service';
  }

  isPrivateTask(task) {
    return task.private;
  }

  isSharedTask(task) {
      return !this.isPrivateTask(task);
  }

  isCreator(task) {
    return (task && task.creator === Meteor.userId() );
  }

  isParticipant(task) {
     if (task && _.contains(task.userIds, Meteor.userId()) ) {
       return true;
     }
     return false;
  }

  isOverdue(task) {
    return this.isOverdueDate(task.dueDate);
  }

  isOverdueDate(taskDate) {
    todayDate = new Date();
    if ( taskDate!=null && todayDate > taskDate )  {
      return true;
    }
    return false;
  }

  isNotOverdue(task) {
    return !this.isOverdue(task);
  }

  isCompleted(task) {
    return task.completed;
  }

  isAcknowledged(task) {
    return task.ack;
  }

  wasEditedByThirdParty(task) {
    return (task.edited && task.editedBy !=Meteor.userId() );
  }

  isOnline() {
    return Meteor.status().connected;
  }

  isOffline() {
    return !Meteor.status().connected;
  }

  isPendingAck(task) {
    if ( task.ack==false && this.needAcknowledgement(task) ) {
      return true;
    }
    return false;
  }

  needAcknowledgement(task) {
    acceptedStatus = this.acceptedStatus['taskAcknowledge'];
    if ( task.ack == false && this.isSharedTask(task) && acceptedStatus.indexOf(task.status)>=0 ) {
      return true;
    }
    return false;
  }

  canShareOnSocialMedia(task) {
    acceptedStatus = this.acceptedStatus['taskSocial'];
    if ( acceptedStatus.indexOf(task.status)>=0 ) {
      return true;
    }
    return false;
  }

  hasPermission(task) {
    if ( task.creator == Meteor.userId() || this.isParticipant(task)  ) {
      return true;
    }

    return false;
  }

  isButton(buttonStyle) {
    if ( buttonStyle=='button') {
      return true;
    }
    return false;
  }

  noDueDate(task) {
    return ( task.dueDate==null);
  }

}

export const statusHelper = new StatusHelper();
