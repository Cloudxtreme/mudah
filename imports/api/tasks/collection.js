import { Mongo } from 'meteor/mongo';


export const Tasks = new Mongo.Collection('tasks');
export const Messages = new Mongo.Collection('messages');

import { contains as _contains } from 'underscore';
import { words as _words } from 'underscore.string';

Tasks.helpers({
  isPromise() {
    return ( this.request==false );
  },
  isRequest() {
    return ( this.request );
  },
  isRequestHeader() {
    return ( this.requestHeader==true );
  },
  isCreator() {
    return ( this.creator == Meteor.userId() );
  },
  isWatcher() {
    if (_contains(this.watcherIds, Meteor.userId()) ) {
      return true;
    }
    return false;
  },
  isPromiser() {
    if (_contains(this.promiserIds, Meteor.userId()) ) {
      return true;
    }
    return false;
  },
  isParticipant() {
     if ( this.isWatcher() || this.isPromiser() ) {
       return true;
     }
     return false;
  },
  isPrivate() {
    return this.private;
  },
  isAcknowledged() {
    return this.ack;
  },
  hasParticipants() {
      return (this.promiserIds.length > 0 || this.watcherIds.length > 0 );
  },
  hasOneParticipant() {
    return ( this.promiserIds.length == 1 || this.watcherIds.length == 1 );
  },
  hasManyParticipants() {
    return ( this.promiserIds.length > 1 || this.watcherIds.length > 1 );
  },
  isGroupRequest() {
    return (this.requestId !=null );
  },
  isArchived() {
    return ( this.archived );
  },
  isCompleted() {
      return ( this.completed );
  },
  isCountered() {
    return ( this.neverCountered==false );
  },
  hasComment() {
    return (this.comment!=null && this.comment.length>0);
  },
  hasPhoto() {
    return (this.photo!=null);
  },
  hasArea() {
    return (this.area!=null);
  },
  hasValue() {
    return (this.value!=null);
  },
  hasDueDate() {
      return (this.dueDate!=null);
  },
  hasReward() {
    return (this.reward!=null && this.reward.length>0);
  },
  hasForfeit() {
    return (this.forfeit!=null && this.forfeit.length>0);
  },
  getRequestRecipientUserId() {
    if ( this.promiserIds!= null) {
      return this.promiserIds[0]; // always ONE only
    }
    return null;
  }
});


/*
Tasks.allow({
  insert(userId, task) {
    console.log("Security check userId=", userId +  " task.creator=", userId);
    return userId && task.creator === userId;
  },
  update(userId, task, fields, modifier) {
    return userId && task.creator === userId;
  },
  remove(userId, task) {
    return userId && task.creator === userId;
  }
});
*/
