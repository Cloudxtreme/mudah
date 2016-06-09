import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');
export const Messages = new Mongo.Collection('messages');

AreaSchema = new SimpleSchema({
  areaId: {type:String},  // short name - health, finance, career,etc
  description: {type: String}
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
