import { Mongo } from 'meteor/mongo';


export const Tasks = new Mongo.Collection('tasks');
export const Messages = new Mongo.Collection('messages');

import { contains as _contains } from 'underscore';
import { words as _words } from 'underscore.string';

Tasks.helpers({
  isRequest() {
    return ( this.request );
  },
  isPromise() {
    return ( this.request==false );
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
  isMyRequest() {
    return ( this.isCreator && this.isRequest );
  },
  isMyPromise() {
    return ( this.isCreator && this.isPromise );
  },
  isWatcher() {
      return ( this.isParticipant && this.isPromise );
  },
  hasArea() {
    return (this.area!=null);
  },
  hasValue() {
    return (this.value!=null);
  },
  hasReward() {
    return (this.reward!=null);
  },
  hasForfeit() {
    return (this.forfeit!=null);
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
