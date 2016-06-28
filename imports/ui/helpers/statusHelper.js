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
import { words as _words } from 'underscore.string';

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


    this.acceptedStatus['taskOffer'] = [this.status.PENDING,this.status.CANCELLED,this.status.REVOKED ];
    this.acceptedStatus['taskComplete'] = [this.status.DONE,this.status.NOTDONE];
    this.acceptedStatus['taskDelete'] = [this.status.DRAFT, this.status.CANCELLED,this.status.REVOKED, this.status.DECLINED];
    this.acceptedStatus['taskDone'] = [this.status.ACTIVE];
    this.acceptedStatus['taskEdit'] = [this.status.DRAFT, this.status.PENDING];
    this.acceptedStatus['taskNotDone'] = [this.status.ACTIVE];
    this.acceptedStatus['taskRevoke'] = [this.status.ACTIVE, this.status.PENDING];
    this.acceptedStatus['taskUnrevoke'] = [this.status.REVOKED, this.status.CANCELLED];

    this.acceptedStatus['taskShare'] = [this.status.DRAFT];
    this.acceptedStatus['taskRequest'] = [this.status.DRAFT];

    this.acceptedStatus['taskAcknowledge'] = [this.status.DECLINED, this.status.DONE,this.status.NOTDONE,
                                              this.status.REVOKED, this.status.CANCELLED];
    this.acceptedStatus['taskSocial'] = [this.status.ACTIVE, this.status.DONE, this.status.NOTDONE, this.status.REVOKED];

    this.acceptedStatus['editComment'] = [this.status.DONE,this.status.NOTDONE, this.status.REVOKED, this.status.CANCELLED];


  }


  allow(task, component) {

      acceptedStatus = this.acceptedStatus[component];
      if (acceptedStatus==undefined) {
        console.log("component not defined, ", component);
        return false;
      }

      //if ( acceptedStatus.indexOf(task.status) >= 0  ) {
      if ( this.isMember(task.status, acceptedStatus) ) {
          return true;
      }

      return false;
  }

  getServiceName(component) {
    return component + 'Service';
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


  isMyTurnToRespond(task) {
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
    if ( this.isMember(task.status, acceptedStatus) && task.ack == false && task.hasParticipants() ) {
      return true;
    }
    return false;
  }

  canShareOnSocialMedia(task) {
    acceptedStatus = this.acceptedStatus['taskSocial'];
    //if ( acceptedStatus.indexOf(task.status)>=0 ) {
    if (  this.isMember(task.status, acceptedStatus) ) {
      return true;
    }
    return false;
  }

  isMember(key, valueArray) {
      if ( valueArray.indexOf(key) >= 0 ) {
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


  getFirstName(name) {
    if (name!=null) {
      return _words(creator.profile.name)[0];
    }
      return "No name";
  }

  getName(userId) {
    if (userId != null) {
      tmpUser = Meteor.users.findOne(userId);
      return tmpUser.profile.name;
    }
    return "";
  }

  sharedWith(task) {
    let firstUser=null;
    let howManyOthers=0;

    if ( task.hasParticipants() ) {
      if ( task.isRequest() ) {
        firstUser = this.getName( task.promiserIds[0] );
        howManyOthers = task.promiserIds.length;
      } else {
        firstUser = this.getName( task.watcherIds[0] );
        howManyOthers = task.watcherIds.length;
      }

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


  log(task) {
    console.log("-------------------------");
    console.log(" isSingleShare=", task.hasOneParticipant());
    console.log(" isGroupShare=", task.hasManyParticipants());
    console.log(" isCreator=", task.isCreator());
    console.log(" isParticipant=", task.isParticipant());
    console.log(" isMyTurnToRespond=", this.isMyTurnToRespond(task));

  }
}

export const statusHelper = new StatusHelper();
