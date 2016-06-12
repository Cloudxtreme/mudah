import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Tasks } from './collection';
import { Messages } from './collection'; 

if (Meteor.isServer) {
  Meteor.publish('tasks', function(listType) {

    if ( this.userId==null) {
      console.log("Nothing to publish for tasks. user is null");
      return;
    }

    console.log("publish tasks user=", this.userId + " listType=", listType);

    if (listType=='promiseList') {
      selector = {'creator': this.userId }; //TEMP only

    } else {
      selector = {
        $and: [
          {"creator": {$ne:this.userId}},
          {"userIds":  this.userId }
        ]
      };
    }

    Counts.publish(this, 'numberOfTasks', Tasks.find(selector), {
      noReady: true
    });

    return Tasks.find(selector);
  });


/*
  Meteor.publish('tasks', function(options, searchString) {
    console.log("publish tasks");
    const selector = {
      $or: [{
        // the public tasks
        $and: [{
          public: true
        }, {
          public: {
            $exists: true
          }
        }]
      }, {
        // when logged in user is the creator
        $and: [{
          creator: this.userId
        }, {
          creator: {
            $exists: true
          }
        }]
      }]
    };


    if (typeof searchString === 'string' && searchString.length) {
      selector.name = {
        $regex: `.*${searchString}.*`,
        $options : 'i'
      };
    }

    Counts.publish(this, 'numberOfTasks', Tasks.find(selector), {
      noReady: true
    });

    return Tasks.find(selector, options);
  });

db.tasks.find({
$and : [
{_id: "a2FxuSkJqNiBzLvb3"},
  {
    $or : [
    {creator: "8xyPRAHAmDZDue3kh"},
    {userIds :"8xyPRAHAmDZDue3kh" }
  ]
  }
] })
*/

Meteor.publish('messages', function(taskId) {
  console.log("publish messages taskId=", taskId + " user=", this.userId);

  if (!this.userId) return;

  // check permission
  const task = Tasks.findOne({
      $and : [
      {_id:  taskId},
        {
          $or : [
          {creator: this.userId},
          {userIds : this.userId }
        ]
        }
      ] });


  if (task) {
    console.log("You have permission to view this task !!");
    return Messages.find({ chatId: taskId},  {fields:{chatId:1,text: 1,timestamp:1,userId:1}});
  } else {
    console.log("ERROR !! Not your TASK !!");
  }

  return this.ready();
});

}
