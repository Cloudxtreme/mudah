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
      //  selector = {'creator': this.userId };
      selector =  { $and: [
                      {requestHeader: false},
                      {
                        $or: [
                          {creator: this.userId},
                          {promiserIds: this.userId}
                        ]
                      },

                    ]};
    } else {
      selector =  { $or: [
                      {
                        $and: [
                          {creator: this.userId},
                          {request: true}
                        ]
                      },
                      {watcherIds: this.userId}
                    ]};
    }

    Counts.publish(this, 'numberOfTasks', Tasks.find(selector), {
      noReady: true
    });

    return Tasks.find(selector);
  });



Meteor.publish('messages', function(taskId) {
  console.log("publish messages taskId=", taskId + " user=", this.userId);

  if (!this.userId) return;

  // check permission
  const task = Tasks.findOne({
      $and : [
        {_id:  taskId},
        { $or : [
            {creator: this.userId},
            {watcherIds : this.userId },
            {promiserIds : this.userId }
          ]
        }
      ]});

  if (task) {
    return Messages.find({ taskId: taskId},  {fields:{taskId:1,text: 1,timestamp:1,userId:1}});
  } else {
    console.log("ERROR !! Not your TASK !!");
  }

  return this.ready();
});

}
