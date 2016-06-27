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
  isParticipant() {
     if (_contains(this.userIds, Meteor.userId()) ) {
       return true;
     }
     return false;
  },
  isPrivate() {
    return this.private;
  },
  isShared() {
      return (this.userIds.length > 0 );
  },
  isSingleShare() {
    return ( this.userIds.length == 1 );
  },
  isGroupShare() {
    return ( this.userIds.length > 1 );
  },
  isGroupRequest() {
    return (this.requestId !=null );
  },
  isMyRequest() {
    return ( this.isCreator && this.isRequest );
  },
  isMyPromise() {
    return ( this.isCreator && this.isPromise );
  },
  isWatcher() {
      return ( this.isParticipant && this.isPromise );
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
  getRequestUserId() {
    if ( this.userIds!= null) {
      return this.userIds[0]; // always ONE only
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
